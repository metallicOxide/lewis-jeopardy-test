# Plan: Add Media Support (Image/YouTube) to Questions & Answers

## Context

Users want to enrich Jeopardy questions and answers with images and YouTube videos. Currently, questions and answers are plain text strings. This change adds optional media (image URL or YouTube embed) to both the question and answer sides, with a generic component design that supports future file upload capabilities.

## Type Changes (`src/types.ts`)

Add media types and restructure `Question` so each side is a `QuestionSide` object:

```typescript
export type MediaType = "image" | "youtube";

export type Media = {
  type: MediaType;
  url: string;
};

export type QuestionSide = {
  text: string;
  media?: Media;
};

export type Question = {
  question: QuestionSide;
  answer: QuestionSide;
  revealed: boolean;
};
```

This changes `question`/`answer` from `string` to `QuestionSide`. All consumers must be updated.

## Files to Modify

### 1. `src/types.ts` — Add `MediaType`, `Media`, `QuestionSide`; update `Question`

### 2. `src/utils/index.ts` — Update `createPlaceholderQuestion`
- Return `{ text: "..." }` objects instead of plain strings for question/answer
- Add `getYouTubeEmbedUrl(url: string): string | null` helper to extract video ID and return embed URL. Handle `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/embed/` formats.

### 3. `src/controller/store.ts` — Add store migration
- Add `version: 1` and `migrate` function to the persist config
- Migration converts old `string` question/answer to `{ text: string }` objects
- Wrap in try/catch; fall back to clearing store on migration failure

### 4. `src/components/AssetInput.tsx` — NEW generic media input component

Props: `{ value: QuestionSide; onChange: (value: QuestionSide) => void; placeholder?: string }`

Behavior:
- Always shows a text input for `value.text`
- Shows an "Add Media" button when no media is set
- Clicking it reveals a media type selector (Image URL / YouTube URL) and a URL input
- When media type is "image" and URL is entered, show a small `<img>` preview (max-h-24)
- A remove/clear button to remove media (sets `media` to `undefined`)
- Designed to be extensible: adding a "file upload" option later just means adding a case

### 5. `src/components/MediaDisplay.tsx` — NEW media rendering component

Props: `{ media: Media; className?: string }`

Behavior:

**Image rendering (`type === "image"`)**:
- Render inside a fixed-size container (e.g. `max-w-[600px] max-h-[400px]` for QuestionScreen, smaller for config preview)
- Use `object-fit: contain` on the `<img>` so images larger than the container are scaled down while preserving aspect ratio
- Images smaller than the container render at their natural size (no upscaling)
- Add `loading="lazy"` for deferred off-screen loading
- Add `onError` handler that shows a "Failed to load image" fallback message

**YouTube rendering (`type === "youtube"`)**:
- Extract video ID via `getYouTubeEmbedUrl` and render a responsive `<iframe>`
- Add `loading="lazy"` on the `<iframe>` for deferred loading
- Use `allowFullScreen` and a fixed aspect ratio container (16:9 via `aspect-video`)

Both media types use `loading="lazy"` for efficient loading.

**Image lightbox modal**:
- Accept an optional `enlargeable?: boolean` prop (enabled on QuestionScreen, not on config preview)
- When `enlargeable` is true and media is an image, show a `cursor-pointer` hover state on the image
- Clicking the image opens a full-screen modal overlay (dark backdrop with `bg-black/80`)
- Modal displays the image at near-full viewport size (`max-w-[90vw] max-h-[90vh]`, `object-fit: contain`)
- Close the modal by clicking the backdrop, clicking an X button, or pressing Escape
- Modal uses a React portal to render at the document root to avoid z-index/overflow issues

### 6. `src/screens/ConfigScreen.tsx` — Integrate `AssetInput`
- Update `updateQuestion` to accept `QuestionSide` instead of `string`
- Replace the two `<input>` elements per question with two `<AssetInput>` components

### 7. `src/screens/QuestionScreen.tsx` — Integrate `MediaDisplay`
- Update rendering to use `question.question.text` / `question.answer.text`
- Add `<MediaDisplay>` above text when media is present on either side

### 8. `src/importer/util.ts` — Add optional CSV columns
- Add `QuestionImageURL?`, `QuestionYouTubeURL?`, `AnswerImageURL?`, `AnswerYouTubeURL?` to `CSVRow`
- `REQUIRED_COLUMNS` stays unchanged (backward compatible)

### 9. `src/importer/index.ts` — Build media from CSV
- Add `buildMedia(imageUrl?, youtubeUrl?): Media | undefined` helper (image takes precedence if both provided)
- Update question construction to produce `QuestionSide` objects with optional media

## Implementation Order

1. `src/types.ts`
2. `src/utils/index.ts`
3. `src/controller/store.ts` (migration)
4. `src/components/MediaDisplay.tsx`
5. `src/components/AssetInput.tsx`
6. `src/screens/ConfigScreen.tsx`
7. `src/screens/QuestionScreen.tsx`
8. `src/importer/util.ts` + `src/importer/index.ts`

## Verification

1. `yarn build` — confirm no type errors
2. `yarn lint` — confirm no lint issues
3. `yarn dev` — manual testing:
   - Open config screen, verify existing text-only flow still works
   - Add an image URL to a question, verify preview appears in config
   - Add a YouTube URL to an answer
   - Start game, click a tile — verify image renders and YouTube iframe embeds
   - Test text-only, media-only, and media+text combinations
   - Import a CSV without media columns — verify backward compatibility
   - Import a CSV with media columns — verify media loads
