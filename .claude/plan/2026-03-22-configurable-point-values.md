# Plan: Configurable Point Values

## Context

`pointValues` is currently hardcoded as `[100, 200, 300, 400, 500]` in the Zustand store and **not persisted** to localStorage. The user wants point values to be configurable from the UI, derived from CSV imports, and the board to handle variable row counts gracefully.

## Changes

### 1. Persist `pointValues` in store (`src/controller/store.ts`)

- Add `pointValues` to the `partialize` config so it persists to localStorage
- Add a `setPointValues` action to the store type and implementation
- When `setPointValues` is called, resize all existing categories' `questions` arrays to match:
  - Adding a point value: append a placeholder question to each category
  - Removing a point value: drop the last question row from each category

### 2. Add Point Values config section to `src/screens/ConfigScreen.tsx`

- New section (above Categories) titled "Point Values" with:
  - A list of current point values, each editable via a number input
  - "Add Row" button to append a new point value (default: last value + 100)
  - "Remove" button on each row (minimum 1 row)
- When point values change, call `setPointValues` which handles resizing category questions
- Pull `setPointValues` from the store

### 3. Update CSV importer (`src/importer/index.ts`)

- Replace `Number` column with `Points` column in `CSVRow` interface
- Required columns become: `Category`, `Points`, `Question`, `Answer`
- New logic:
  1. Parse all rows, collecting each row's `Points` value (parsed as number)
  2. Group rows by category name
  3. Find the category with the most rows — its unique point values (sorted ascending) become the new `pointValues` config
  4. For each category, map each row's question to the index matching its `Points` value in the derived `pointValues` array
  5. Fill missing slots with placeholder questions
- Return type changes to `{ categories: Category[], pointValues: number[] }` so ConfigScreen can call both `setCategories` and `setPointValues`
- Update ConfigScreen's `handleCSVUpload` to destructure and apply both

### 4. Make BoardScreen questions scrollable (`src/screens/BoardScreen.tsx`)

- Change the outer container from `min-h-screen` to `h-screen flex flex-col`
- Keep header and score bar as fixed-height elements
- Make the questions grid area `flex-1 overflow-y-auto` so it scrolls when rows exceed viewport
- Each question column already uses `flex flex-col gap-2`; add `flex-1` to each question button so they grow equally within the column

## Files to modify

1. `src/controller/store.ts` — persist pointValues, add `setPointValues` action
2. `src/screens/ConfigScreen.tsx` — add point values editor UI section
3. `src/importer/index.ts` — support `Points` column, return pointValues alongside categories
4. `src/screens/BoardScreen.tsx` — flex-grow scrollable layout

## Verification

1. `yarn build` — ensure no type errors
2. `yarn dev` — manual testing:
   - Add/remove/edit point values in ConfigScreen, verify board reflects changes
   - Upload CSV with `Points` column, verify pointValues are derived correctly
   - Resize browser to verify BoardScreen scrolls vertically with many rows
