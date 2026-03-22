# Extract Shared ScoreBar Component

## Context

`BoardScreen.tsx` (lines 78-107) and `QuestionScreen.tsx` (lines 103-132) both contain an identical team score bar UI: a grid of team cards, each with a name, editable score input, and +/- buttons. The only differences are the outer wrapper styling and how the point increment value is determined. Extracting this removes ~30 lines of duplication.

## Plan

### 1. Create `src/components/ScoreBar.tsx`

**Props:**

```tsx
type ScoreBarProps = {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  numTeams: number;
  pointIncrement: number; // BoardScreen passes 100, QuestionScreen passes pointValues[qIndex]
  className?: string; // outer wrapper styling differs: "p-6 rounded-lg" vs "p-4"
};
```

**Contains:**

- `updateTeamScore(teamIndex, change)` — uses `pointIncrement` prop
- `updateTeamScoreDirect(teamIndex, value)` — same in both screens
- The grid layout with team cards (name, score input, +/- buttons)
- Imports `Plus`, `Minus` from lucide-react

### 2. Update `src/screens/BoardScreen.tsx`

- Remove `updateTeamScore`, `updateTeamScoreDirect`, and the score bar JSX (lines 28-107)
- Remove `Plus`, `Minus` imports from lucide-react
- Import and render `<ScoreBar teams={teams} setTeams={setTeams} numTeams={numTeams} pointIncrement={pointValues[0]} className="p-6 rounded-lg" />`

### 3. Update `src/screens/QuestionScreen.tsx`

- Remove `updateTeamScore`, `updateTeamScoreDirect`, and the score bar JSX (lines 47-132)
- Remove `Plus`, `Minus` imports from lucide-react
- Import and render `<ScoreBar teams={teams} setTeams={setTeams} numTeams={numTeams} pointIncrement={pointValues[qIndex]} className="p-4" />`

## Files

- **Create**: `src/components/ScoreBar.tsx`
- **Edit**: `src/screens/BoardScreen.tsx`
- **Edit**: `src/screens/QuestionScreen.tsx`

## Verification

1. `npx tsc --noEmit` — no type errors
2. Dev server — board and question screens still show team scores, +/- works, direct edit works
