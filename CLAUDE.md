# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Jeopardy-style game board built with React + TypeScript + Vite. Supports configurable categories/questions, team scoring, CSV import for bulk question loading, and persists game state to localStorage.

## Commands

- `yarn dev` — start dev server with HMR
- `yarn build` — production build (runs `vite build`)
- `yarn lint` — lint with ESLint (`eslint .`)
- `yarn preview` — preview production build

## Architecture

`src/App.tsx` is a thin router that holds shared game state and delegates rendering to screen components in `src/screens/` based on `GameStatus`. Prefer small, atomic components — avoid putting logic or UI directly in `App.tsx`.

Screen components (`src/screens/`):
- **`StartScreen`** — team setup (count, names)
- **`ConfigScreen`** — category/question editing, CSV upload
- **`BoardScreen`** — the game board grid with score bar
- **`QuestionScreen`** — question display, answer reveal, scoring

Key modules:
- **`src/controller/index.ts`** — `useLocalState` hook: a curried useState wrapper that auto-syncs to localStorage under a single `JEOPARDY_GAME_STATE` key. Usage pattern: `useLocalState(STATE_KEY.X)<Type>(default)`.
- **`src/importer/index.ts`** — CSV import via PapaParse. Expects columns: `Category`, `Number` (0-indexed into pointValues array), `Question`, `Answer`.
- **`src/types.ts`** — All shared types (`GameStatus`, `Category`, `Question`, `Team`, `GameState`) and `STATE_KEY` constants.

## Tech Stack

- React 18, TypeScript, Vite
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.js`)
- Icons: lucide-react
- CSV parsing: papaparse
- Package manager: Yarn
