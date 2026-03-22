import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, GameStatus, Team } from "../types";

const POINT_VALUES = [100, 200, 300, 400, 500];

type JeopardyStore = {
  // States
  gameState: GameStatus;
  categories: Category[];
  teams: Team[];
  selectedTile: { catIndex: number; qIndex: number } | null;
  pointValues: number[];

  // Actions
  setGameState: (state: GameStatus) => void;
  setCategories: (categories: Category[]) => void;
  setTeams: (teams: Team[]) => void;
  setSelectedTile: (tile: { catIndex: number; qIndex: number } | null) => void;
  setPointValues: (pointValues: number[]) => void;
  resetGame: () => void;
};

export const useGameStore = create<JeopardyStore>()(
  persist(
    (set) => ({
      gameState: "start",
      categories: [
        {
          name: "Category 1",
          questions: POINT_VALUES.map((points) => ({
            question: `Question for Category 1 - ${points}`,
            answer: `Answer for Category 1 - ${points}`,
            revealed: false,
          })),
        },
      ],
      teams: Array(2)
        .fill(null)
        .map((_, i) => ({
          name: `Team ${i + 1}`,
          score: 0,
        })),
      selectedTile: null,
      pointValues: POINT_VALUES,

      setGameState: (gameState) => set({ gameState }),
      setCategories: (categories) => set({ categories }),
      setTeams: (teams) => set({ teams }),
      setSelectedTile: (selectedTile) => set({ selectedTile }),
      setPointValues: (pointValues) =>
        set((state) => ({
          pointValues,
          categories: state.categories.map((cat) => {
            const currentLen = cat.questions.length;
            const newLen = pointValues.length;
            if (newLen > currentLen) {
              return {
                ...cat,
                questions: [
                  ...cat.questions,
                  ...pointValues.slice(currentLen).map((points) => ({
                    question: `Question for ${cat.name} - ${points}`,
                    answer: `Answer for ${cat.name} - ${points}`,
                    revealed: false,
                  })),
                ],
              };
            } else if (newLen < currentLen) {
              return {
                ...cat,
                questions: cat.questions.slice(0, newLen),
              };
            }
            return cat;
          }),
        })),
      resetGame: () =>
        set((state) => ({
          gameState: "start",
          categories: state.categories.map((cat) => ({
            ...cat,
            questions: cat.questions.map((q) => ({ ...q, revealed: false })),
          })),
          teams: state.teams.map((team) => ({ ...team, score: 0 })),
        })),
    }),
    {
      name: "JEOPARDY_GAME_STATE",
      partialize: (state) => ({
        gameState: state.gameState,
        categories: state.categories,
        teams: state.teams,
        pointValues: state.pointValues,
      }),
    },
  ),
);
