# Extract ScoreBar Component

**Plan**: `.claude/plan/2026-03-22-extract-scorebar-component.md`

## Summary
Extracted the duplicated team score bar UI from `BoardScreen.tsx` and `QuestionScreen.tsx` into a shared `ScoreBar` component. The component accepts a `pointIncrement` prop (100 for board, `pointValues[qIndex]` for question) and an optional `className` for outer wrapper styling differences.

## Files
- **Created**: `src/components/ScoreBar.tsx`
- **Modified**: `src/screens/BoardScreen.tsx` — removed score handlers and JSX, replaced with `<ScoreBar>`
- **Modified**: `src/screens/QuestionScreen.tsx` — removed score handlers and JSX, replaced with `<ScoreBar>`

## Commit
`8b26b98` on `refactor/split_into_components`
