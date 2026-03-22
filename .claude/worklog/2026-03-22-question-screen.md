# QuestionScreen extraction

Plan: `.claude/plan/2026-03-22-refactor-app-into-screen-components.md`

## Summary

Extracted the Question Screen UI and its associated logic from `src/App.tsx` into a standalone `QuestionScreen` component. The component co-locates all state and handlers that are only used on the question screen:

- `showAnswer` / `setShowAnswer` state (moved into component)
- `handleRevealAnswer()` — reveals answer and marks tile as revealed
- `handleBack()` — clears selected tile and returns to board
- `updateTeamScore()` / `updateTeamScoreDirect()` — score manipulation using selected tile's point value
- `useEffect` for keyboard shortcuts (ESC to go back, Spacebar to reveal)

The component receives only the props it needs via a typed `QuestionScreenProps` interface.

## Files created

- `src/screens/QuestionScreen.tsx`

## Files not yet modified

- `src/App.tsx` — still contains the original code; will be updated when all screen components are ready and the app is wired up as a thin router.

## Commit

`305a0c6` — refactor: extract QuestionScreen component from App.tsx
