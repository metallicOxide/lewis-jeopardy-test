# Plan: Supabase Image Upload in AssetInput

**Date:** 2026-04-04

## Context

The game config screen allows users to attach media (image URL or YouTube) to questions/answers via `AssetInput`. We need to extend this with a third option — uploading an image file directly — storing it in Supabase Storage. Uploaded images should be cleaned up after 1 month (Supabase Storage has no native per-file TTL; we handle this via client-side cleanup on app load using the built-in `created_at` field on storage objects).

---

## Approach

1. Add Supabase client + image upload helpers
2. Add a `FileUploadDropzone` component (shadcnblocks file-upload-dropzone-4 style)
3. Extend `AssetInput` with an "Upload Image" option alongside existing "Image URL" / "YouTube URL"
4. Mark uploaded images in the `Media` type so we know when to call delete on Supabase
5. Run cleanup of expired images on app load

---

## Supabase Setup (one-time, manual)

Since creating from scratch:

1. Create a Supabase project at supabase.com
2. Create a **public** Storage bucket named `jeopardy-images`
3. Set bucket RLS policies to allow anonymous upload, read, and delete (or use service key)
4. Copy project URL and anon key to `.env.local`

---

## Files to Create

### `src/supabase/client.ts`

Initialize Supabase client from env vars:

```ts
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
```

### `src/supabase/imageUpload.ts`

Three exported functions:

- `uploadImage(file: File): Promise<string>` — generates a UUID v4 filename, uploads to `jeopardy-images` bucket, returns the public URL
- `deleteImage(url: string): Promise<void>` — extracts filename from the URL path, deletes from bucket
- `cleanupExpiredImages(): Promise<void>` — lists all files in the bucket, deletes those where `created_at` is older than 30 days

### `src/components/FileUploadDropzone.tsx`

Drag-and-drop file upload component (shadcnblocks dropzone-4 style):

- Accepts `image/*` files only
- Shows drag-over state with visual feedback
- Shows upload progress/loading spinner while uploading
- Calls `onUpload(url: string)` callback on success
- Shows error message on failure
- Styled to match the existing blue Jeopardy theme

---

## Files to Modify

### `src/types.ts`

Add `uploaded?: boolean` to `Media` to distinguish Supabase-hosted images from external URLs (needed to know when to call `deleteImage` on remove):

```ts
export type Media = {
  type: MediaType;
  url: string;
  uploaded?: boolean;
};
```

### `src/components/AssetInput.tsx`

- Add local state `mediaInputMode: 'url' | 'upload' | null`
- Extend the media picker to show three buttons: **Image URL**, **Upload Image**, **YouTube URL**
- When `mediaInputMode === 'url'` and no URL yet: show URL text input (existing behavior)
- When `mediaInputMode === 'upload'` and no URL yet: show `FileUploadDropzone`
- On successful upload: `onChange({ ...value, media: { type: 'image', url, uploaded: true } })`
- On "Remove Media": if `value.media?.uploaded`, call `deleteImage(value.media.url)` before clearing
- Image preview (for both URL and uploaded) remains unchanged — shows `<img>` when `type === 'image'` and url is set

### `src/App.tsx`

Add a `useEffect` on mount to call `cleanupExpiredImages()` (fire-and-forget, no UI impact).

### `package.json` / `yarn.lock`

Install `@supabase/supabase-js` and `uuid` (+ `@types/uuid` as dev dependency).

### `.env.local` (not committed)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Key Implementation Notes

- **UUID generation**: Use `import { v4 as uuidv4 } from 'uuid'` — install `uuid` package (+ `@types/uuid` dev dep)
- **Bucket path**: Store as `<uuid>.<ext>` in the root of the bucket (e.g. `abc123.jpg`)
- **Public URL**: Derived via `supabase.storage.from('jeopardy-images').getPublicUrl(path).data.publicUrl`
- **Cleanup**: `list()` returns objects with `created_at`; filter those older than `Date.now() - 30 * 24 * 60 * 60 * 1000`
- **Delete on remove**: Only fires if `media.uploaded === true` — externally linked images are unaffected
- **No Shadcn/Radix dependency needed**: Implement the dropzone using native HTML drag events + a visually styled `<div>`

---

## Verification

1. Run `yarn dev`
2. Go to Config → open a question → click "Add Media" → confirm three options appear
3. Select "Upload Image" → drag or click to upload an image → confirm it uploads and preview appears
4. Select "Image URL" → confirm existing URL behavior is unchanged
5. Remove an uploaded image → confirm it's deleted from the Supabase bucket (check Storage in Supabase dashboard)
6. Manually set `created_at` of a test file to >30 days ago in bucket metadata, reload the app → confirm it is deleted
7. Run `yarn build` to confirm no TypeScript errors
