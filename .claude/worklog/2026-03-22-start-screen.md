# StartScreen Component Extraction

**Plan**: `.claude/plan/2026-03-22-refactor-app-into-screen-components.md`

## Summary

Extracted the Start Screen UI and its associated handlers from `src/App.tsx` into a standalone `StartScreen` component. The component receives only the props it needs via a `StartScreenProps` type and co-locates the following handlers:

- `handleNumTeamsChange()` — clamps team count to 1-8 and rebuilds the teams array
- `updateTeamName()` — updates a single team's name by index
- `startGame()` — transitions game state to 'board'

## Files created

- `src/screens/StartScreen.tsx`

## Files not yet modified

- `src/App.tsx` — still contains the original Start Screen code; will be updated when App.tsx is converted to a thin router (final step of the plan)

## Commit

`9a1f414` — refactor: extract StartScreen component from App.tsx
