# ConfigScreen extraction

**Plan**: `.claude/plan/2026-03-22-refactor-app-into-screen-components.md`

## Summary

Extracted the ConfigScreen component from `src/App.tsx` as part of the screen decomposition refactor. The component encapsulates all config-related UI and handlers:

- `updateCategoryName()` - edit category names
- `addCategory()` - add new categories with default questions
- `removeCategory()` - remove categories (minimum 1)
- `updateQuestion()` - edit question/answer text
- `handleCSVUpload()` - import categories from CSV files
- `resetGame()` - reset all scores and revealed state, navigate to start

The component accepts a `ConfigScreenProps` type with only the props it needs: `categories`, `setCategories`, `teams`, `setTeams`, `setGameState`, and `pointValues`.

## Files created

- `src/screens/ConfigScreen.tsx`

## Commit

`e62232f` - refactor: extract ConfigScreen component from App.tsx
