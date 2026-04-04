# Architecture

## Overview

A purely client-side React application. There is no backend server — game state is persisted to `localStorage` via Zustand middleware, and Supabase Storage is the only external service (used for uploaded images).

## Directory structure

```
src/
├── App.tsx               # Root component — screen router + cleanup trigger
├── types.ts              # All shared TypeScript types
├── main.tsx              # React entry point
│
├── screens/              # Full-page views, one per GameStatus value
│   ├── StartScreen.tsx   # Team setup
│   ├── ConfigScreen.tsx  # Category/question editor, CSV import
│   ├── BoardScreen.tsx   # Game board grid + score bar
│   └── QuestionScreen.tsx# Question display and answer reveal
│
├── components/           # Reusable UI components
│   ├── AssetInput.tsx    # Text + media editor for a question/answer side
│   ├── FileUploadDropzone.tsx  # Drag-and-drop image upload widget
│   ├── MediaDisplay.tsx  # Renders image (with lightbox) or YouTube embed
│   └── ScoreBar.tsx      # Team scores with +/- controls
│
├── controller/           # State management
│   ├── index.ts          # Re-exports useGameStore
│   └── store.ts          # Zustand store with localStorage persistence
│
├── supabase/             # Supabase integration
│   ├── client.ts         # Supabase client initialisation
│   └── imageUpload.ts    # uploadImage, deleteImage, cleanupExpiredImages
│
├── importer/             # CSV import logic
│   ├── index.ts          # importQuestionsFromCSV — parses file, returns state shape
│   └── util.ts           # CSV validation, row parsing, point value derivation
│
└── utils/
    ├── index.ts           # createPlaceholderQuestion, getYouTubeEmbedUrl
    └── FileUploadDropzone.ts  # compressImage — canvas-based client-side compression
```

## Screen routing

`App.tsx` reads `gameState` from the Zustand store and renders the matching screen. There is no URL-based router.

```
gameState === "start"    → StartScreen
gameState === "config"   → ConfigScreen
gameState === "board"    → BoardScreen
gameState === "question" → QuestionScreen  (only when selectedTile is set)
```

## State management

All game state lives in a single Zustand store (`src/controller/store.ts`) and is persisted to `localStorage` under the key `JEOPARDY_GAME_STATE`.

```
GameState
├── gameState: GameStatus          # current screen
├── categories: Category[]         # all categories and their questions
├── teams: Team[]                  # team names and scores
├── pointValues: number[]          # ordered list of point rows
└── selectedTile: { catIndex, qIndex } | null  # active question (not persisted)
```

`selectedTile` is excluded from persistence — refreshing always returns to the board.

The store includes a migration function to handle the old schema format (plain string questions) so existing localStorage data is not broken.

## Data model

```
Category
└── questions: Question[]       # one per point value row

Question
├── question: QuestionSide
├── answer:   QuestionSide
└── revealed: boolean

QuestionSide
├── text?:  string
└── media?: Media

Media
├── type:      "image" | "youtube"
├── url:       string
└── uploaded?: boolean          # true = stored in Supabase, triggers delete on remove
```

## Component responsibilities

### `AssetInput`

Edits a single `QuestionSide`. Manages three modes for media:

- **No media** — shows "Add Media" button
- **Image URL** — shows a text input; preview rendered inline
- **Upload Image** — shows `FileUploadDropzone`; on success sets `media.uploaded = true`
- **YouTube URL** — shows a text input

On remove, calls `deleteImage()` if `media.uploaded` is true.

### `FileUploadDropzone`

Handles drag-and-drop and click-to-browse. On file selection:

1. Validates `image/*` MIME type
2. Calls `compressImage()` from `src/utils/FileUploadDropzone.ts`
3. Calls `uploadImage()` from `src/supabase/imageUpload.ts`
4. Fires `onUpload(url)` callback

### `MediaDisplay`

Read-only media renderer used in `QuestionScreen`. Images open a lightbox on click. YouTube URLs are converted to embed URLs via `getYouTubeEmbedUrl()`.

## Supabase Storage

### Bucket

A single public bucket: `jeopardy-images`. Provisioned via SQL migration at `supabase/migrations/20260404000000_create_jeopardy_images_bucket.sql`.

RLS policies allow anonymous `SELECT`, `INSERT`, and `DELETE` — appropriate for a local game tool with no user authentication.

### Image lifecycle

```
Upload
  File selected → compressImage() → uploadImage() → public URL → saved in game state

Delete
  Remove clicked → deleteImage(url) → file removed from bucket → media cleared from state

Cleanup (on app load)
  cleanupExpiredImages() → list all bucket objects → delete any with created_at > 30 days ago
```

### Compression (`src/utils/FileUploadDropzone.ts`)

All uploads are compressed before leaving the browser:

- Max dimension: **1280px** (longest edge, aspect ratio preserved)
- Output format: **JPEG at 82% quality**
- Implementation: native Canvas API (`drawImage` → `toBlob`) — no external library

## CSV import

`src/importer/index.ts` uses PapaParse to parse an uploaded `.csv` file. The importer:

- Requires `Category` and `Points` columns; optional text and media columns per row
- Groups rows by category, derives the canonical point values from the largest category
- Fills missing questions with placeholder text so the grid stays rectangular
- Throws descriptive errors for missing columns or empty files

## No-backend constraints

- No server, no auth, no database
- Game state: `localStorage` only
- Images: Supabase Storage with anonymous access
- TTL enforcement: client-side cleanup on app load (see `cleanupExpiredImages`)
