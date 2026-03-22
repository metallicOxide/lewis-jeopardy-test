# BoardScreen Component Extraction

**Plan**: `.claude/plan/2026-03-22-refactor-app-into-screen-components.md`

## Summary

Extracted the Board Screen (lines 393-464 of `src/App.tsx`) into a standalone `BoardScreen` component as part of the screen-splitting refactor. Co-located the following handlers from App.tsx into the new component:

- `handleTileClick()` — calls `setSelectedTile` and `setGameState` props to navigate to the question screen
- `updateTeamScore()` — adjusts a team's score by the base point value
- `updateTeamScoreDirect()` — sets a team's score to an explicit numeric value

Defined a `BoardScreenProps` type with only the props this screen needs: `categories`, `teams`, `setTeams`, `numTeams`, `pointValues`, `setSelectedTile`, and `setGameState`.

## Files created

- `src/screens/BoardScreen.tsx`

## Verification

- `npx tsc --noEmit` passes with no type errors.

## Commit

`a4d10ba` — refactor: extract BoardScreen component from App.tsx
