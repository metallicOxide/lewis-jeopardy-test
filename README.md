# Jeopardy Game Board

A Jeopardy-style game board for running live quiz games. Configure categories and questions, add images or YouTube clips as media, import questions from CSV, and track team scores — all in the browser with no backend required.

## Getting started

### 1. Install dependencies

```bash
yarn
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Both values are in your Supabase project under **Settings → API**.

### 3. Set up Supabase Storage

Install the [Supabase CLI](https://supabase.com/docs/guides/cli), then link and push:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

This runs the migration that creates the `jeopardy-images` storage bucket with the correct RLS policies.

### 4. Start the dev server

```bash
yarn dev
```

## Commands

| Command        | Description               |
| -------------- | ------------------------- |
| `yarn dev`     | Start dev server with HMR |
| `yarn build`   | Production build          |
| `yarn lint`    | Lint with ESLint          |
| `yarn preview` | Preview production build  |

## Game flow

```
Start screen → Config screen → Board screen → Question screen
```

1. **Start** — enter team names
2. **Config** — set categories, point values, questions, answers, and media; or import from CSV
3. **Board** — click a tile to open a question
4. **Question** — reveal the answer and award points to a team

## CSV import

Questions can be bulk-imported from a CSV file on the Config screen. Required columns:

| Column               | Description                               |
| -------------------- | ----------------------------------------- |
| `Category`           | Category name                             |
| `Points`             | Point value (numeric)                     |
| `Question`           | Question text                             |
| `Answer`             | Answer text                               |
| `QuestionImageURL`   | _(optional)_ Image URL for the question   |
| `QuestionYouTubeURL` | _(optional)_ YouTube URL for the question |
| `AnswerImageURL`     | _(optional)_ Image URL for the answer     |
| `AnswerYouTubeURL`   | _(optional)_ YouTube URL for the answer   |

## Image uploads

Images can be attached to questions and answers either by URL or by uploading a file directly. Uploaded files are stored in the `jeopardy-images` Supabase Storage bucket.

- Images are compressed and resized client-side before upload (max 1280px, JPEG 82% quality)
- Each image is stored with a UUID v4 filename
- Removing an uploaded image from a question deletes it from the bucket immediately
- On every app load, images older than 30 days are automatically purged from the bucket

## Tech stack

- **React 18** + **TypeScript**
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — utility-first styling
- **Zustand** — state management with localStorage persistence
- **Supabase Storage** — image hosting
- **PapaParse** — CSV parsing
- **lucide-react** — icons
- **uuid** — UUID v4 generation for image filenames
