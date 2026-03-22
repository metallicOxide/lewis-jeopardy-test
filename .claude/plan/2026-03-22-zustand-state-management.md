# Migrate State Management to Zustand with Persist

## Context

`App.tsx` currently holds all shared state via `useState` and a custom `useLocalState` hook, then prop-drills 8-11 props into each screen component. Migrating to Zustand with its `persist` middleware will:

- Eliminate prop drilling across all screens and components
- Replace the custom `useLocalState` hook with Zustand's built-in persist middleware
- Give each screen direct access to only the state it needs via selector hooks

## Plan

### 1. Install Zustand

```bash
npm install zustand
```

### 2. Create Zustand store in `src/controller/store.ts`

**Store shape** (mirrors current App.tsx state):

```tsx
type JeopardyStore = {
  // State
  gameState: GameStatus;
  categories: Category[];
  teams: Team[];
  selectedTile: { catIndex: number; qIndex: number } | null;
  pointValues: number[]; // constant, but convenient to co-locate

  // Actions
  setGameState: (state: GameStatus) => void;
  setCategories: (categories: Category[]) => void;
  setTeams: (teams: Team[]) => void;
  setSelectedTile: (tile: { catIndex: number; qIndex: number } | null) => void;
};
```

**Persist config:**

- Use `persist` middleware from `zustand/middleware`
- Storage key: `JEOPARDY_GAME_STATE` (same as current, preserves existing user data)
- `partialize` to only persist `gameState`, `categories`, `teams` (same 3 fields currently persisted)
- `selectedTile`, `pointValues` remain ephemeral (not persisted)

**Defaults** (for keys not in localStorage):

- `gameState`: `'start'`
- `categories`: single category with 5 placeholder questions
- `teams`: 2 teams named "Team 1" and "Team 2" with score 0
- `selectedTile`: null
- `pointValues`: [100, 200, 300, 400, 500]

### 3. Update `src/controller/index.ts`

- Remove the `useLocalState` hook, `saveState`, `getState` helpers
- Re-export the store from `store.ts` so existing import paths (`from '../controller'`) still work

### 4. Update `src/App.tsx`

Strip down to a pure router with no state — just reads `gameState` and `selectedTile` from the store:

```tsx
const JeopardyGame = () => {
  const gameState = useGameStore((s) => s.gameState);
  const selectedTile = useGameStore((s) => s.selectedTile);

  if (gameState === "start") return <StartScreen />;
  if (gameState === "config") return <ConfigScreen />;
  if (gameState === "question" && selectedTile) return <QuestionScreen />;
  return <BoardScreen />;
};
```

### 5. Update each screen component to use the store directly

Remove all props — each screen calls `useGameStore` with selectors for only what it needs.

**`src/screens/StartScreen.tsx`** — uses: `teams`, `setTeams`, `setGameState`

**`src/screens/ConfigScreen.tsx`** — uses: `categories`, `setCategories`, `teams`, `setTeams`, `setGameState`, `pointValues`

**`src/screens/QuestionScreen.tsx`** — uses: `categories`, `setCategories`, `teams`, `setTeams`, `pointValues`, `selectedTile`, `setSelectedTile`, `setGameState`

**`src/screens/BoardScreen.tsx`** — uses: `categories`, `teams`, `setTeams`, `pointValues`, `setSelectedTile`, `setGameState`

**`src/components/ScoreBar.tsx`** — uses: `teams`, `setTeams`. Still takes `pointIncrement` and `className` as props (these are caller-specific, not global state).

### 6. Update `src/types.ts`

- Remove `GameState` type (replaced by Zustand store type)
- Remove `STATE_KEY` const (no longer needed — persist handles keys)
- Keep `Category`, `Team`, `Question`, `GameStatus` types

## Files to modify

- **Install**: `zustand` package
- **Create**: `src/controller/store.ts`
- **Edit**: `src/controller/index.ts` — remove old hook, re-export store
- **Edit**: `src/App.tsx` — remove all state, use store selectors
- **Edit**: `src/screens/StartScreen.tsx` — remove props, use store
- **Edit**: `src/screens/ConfigScreen.tsx` — remove props, use store
- **Edit**: `src/screens/QuestionScreen.tsx` — remove props, use store
- **Edit**: `src/screens/BoardScreen.tsx` — remove props, use store
- **Edit**: `src/components/ScoreBar.tsx` — replace `teams`/`setTeams` props with store, keep `pointIncrement`/`className` as props
- **Edit**: `src/types.ts` — remove `GameState` type and `STATE_KEY`

## Verification

1. `npx tsc --noEmit` — no type errors
2. Dev server — all 4 screens work, state transitions correctly
3. Refresh browser — persisted state (gameState, categories, teams) survives reload
4. Non-persisted state (selectedTile) resets on reload
5. Clear localStorage — app loads with sensible defaults
