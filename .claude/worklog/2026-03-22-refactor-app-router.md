# Refactor App.tsx into Thin Router

**Plan**: `.claude/plan/2026-03-22-refactor-app-into-screen-components.md`

## Summary

Final step of the refactoring plan. Rewrote `src/App.tsx` from a 467-line monolithic component down to a ~50-line thin router. All screen-specific JSX, handler functions, the `showAnswer` state, and the keyboard shortcut `useEffect` were removed. The component now holds only shared state and delegates rendering to the 4 screen components based on `gameState`.

## Removed from App.tsx
- `showAnswer` state
- `useEffect` for keyboard shortcuts (ESC / Spacebar)
- 14 handler functions: `handleTileClick`, `handleBack`, `handleRevealAnswer`, `resetGame`, `updateTeamScore`, `updateTeamScoreDirect`, `updateCategoryName`, `addCategory`, `removeCategory`, `updateQuestion`, `updateTeamName`, `handleNumTeamsChange`, `startGame`, `handleCSVUpload`
- All screen-specific JSX (~400 lines)
- Unused imports: `React` (as namespace), `Plus`, `Minus`, `Trash2`, `Upload` from lucide-react, `importQuestionsFromCSV`

## Files Modified
- `src/App.tsx` — stripped to thin router (11 additions, 428 deletions)

## Verification
- `npx tsc --noEmit` passes with no errors

## Commit
- `92b541c` — refactor: reduce App.tsx to thin router delegating to screen components
