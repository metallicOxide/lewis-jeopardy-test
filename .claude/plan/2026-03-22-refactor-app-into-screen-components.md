# Refactor App.tsx into Screen Components

## Context

`src/App.tsx` is a 467-line monolithic component containing all 4 game screens (start, config, question, board) plus all state and handler logic. The goal is to split each screen into its own component file and co-locate hooks/handlers to where they're actually used.

## Approach

### 1. Create screen components directory

Create `src/screens/` with 4 files:

- `StartScreen.tsx`
- `ConfigScreen.tsx`
- `QuestionScreen.tsx`
- `BoardScreen.tsx`

### 2. Identify shared vs screen-specific state

**Shared state** (stays in App.tsx, passed as props):

- `gameState` / `setGameState` — used by all screens for navigation
- `categories` / `setCategories` — used by start (indirectly), config, question, board
- `teams` / `setTeams` — used by start, config (reset), question, board
- `numTeams` / `setNumTeams` — used by start, question, board
- `pointValues` — constant, used everywhere

**Screen-specific state** (co-locate into screen component):

- `selectedTile` / `setSelectedTile` — only used in board (to set) and question (to read/use) → keep in App but only passed to those screens
- `showAnswer` / `setShowAnswer` — only used in question screen → move into QuestionScreen

### 3. Co-locate hooks and handlers

**QuestionScreen** will own:

- `showAnswer` state
- `handleRevealAnswer()`
- `handleBack()`
- `updateTeamScore()` / `updateTeamScoreDirect()`
- `useEffect` for keyboard shortcuts (ESC / Spacebar)

**ConfigScreen** will own:

- `updateCategoryName()`
- `addCategory()`
- `removeCategory()`
- `updateQuestion()`
- `handleCSVUpload()`
- `resetGame()`

**StartScreen** will own:

- `handleNumTeamsChange()`
- `updateTeamName()`
- `startGame()`

**BoardScreen** will own:

- `handleTileClick()` (calls back to parent to set selectedTile + navigate)
- `updateTeamScore()` / `updateTeamScoreDirect()`

### 4. App.tsx becomes a thin router

```tsx
const JeopardyGame = () => {
  const pointValues = [100, 200, 300, 400, 500];
  const [gameState, setGameState] = useLocalState(STATE_KEY.GAME_STATUS)<GameStatus>('start');
  const [categories, setCategories] = useLocalState(STATE_KEY.CATEGORY)<Category[]>([...]);
  const [teams, setTeams] = useLocalState(STATE_KEY.TEAMS)<Team[]>([...]);
  const [numTeams, setNumTeams] = useState(8);
  const [selectedTile, setSelectedTile] = useState<...>(null);

  if (gameState === 'start') return <StartScreen ... />;
  if (gameState === 'config') return <ConfigScreen ... />;
  if (gameState === 'question' && selectedTile) return <QuestionScreen ... />;
  return <BoardScreen ... />;
};
```

### 5. Files to modify

- **Edit**: `src/App.tsx` — strip down to router + shared state
- **Create**: `src/screens/StartScreen.tsx`
- **Create**: `src/screens/ConfigScreen.tsx`
- **Create**: `src/screens/QuestionScreen.tsx`
- **Create**: `src/screens/BoardScreen.tsx`

### 6. Props pattern

Each screen receives only what it needs. Example for StartScreen:

```tsx
type StartScreenProps = {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  numTeams: number;
  setNumTeams: (n: number) => void;
  setGameState: (state: GameStatus) => void;
};
```

## Verification

1. Run `npm run build` (or `npx tsc --noEmit`) to confirm no type errors
2. Run the dev server and test all 4 screens work:
   - Start screen: change team count, edit names, navigate to config/game
   - Config screen: add/remove categories, edit questions, upload CSV, reset
   - Board screen: click tiles, verify scores, navigate to config
   - Question screen: reveal answer, keyboard shortcuts, score +/-, ESC back
3. Verify localStorage persistence still works across screen transitions
