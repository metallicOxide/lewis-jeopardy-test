import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BuzzEntry, Category, GameStatus, Role, Team } from "../types";
import { createPlaceholderQuestion } from "../utils";

const POINT_VALUES = [100, 200, 300, 400, 500];

type JeopardyStore = {
  // States
  gameState: GameStatus;
  categories: Category[];
  teams: Team[];
  selectedTile: { catIndex: number; qIndex: number } | null;
  pointValues: number[];

  // Multiplayer states (session-only, not persisted)
  role: Role;
  roomCode: string | null;
  buzzOrder: BuzzEntry[];

  playerInformation: {
    id: string;
    name: string;
    roomCode: string;
  } | null;

  // Actions
  setGameState: (state: GameStatus) => void;
  setCategories: (categories: Category[]) => void;
  setTeams: (teams: Team[]) => void;
  setSelectedTile: (tile: { catIndex: number; qIndex: number } | null) => void;
  setPointValues: (pointValues: number[]) => void;
  resetGame: () => void;

  // Multiplayer actions
  setRole: (role: Role) => void;
  setRoomCode: (code: string | null) => void;
  addTeam: (team: Team) => void;
  addBuzz: (entry: BuzzEntry) => void;
  clearBuzzOrder: () => void;
  removeTeam: (id: string) => void;

  // Player interaction
  setPlayerInformtion: (name: string, gameCode: string) => void;
};

export const useGameStore = create<JeopardyStore>()(
  persist(
    (set) => ({
      gameState: "role-select",
      categories: [
        {
          name: "Category 1",
          questions: POINT_VALUES.map((points) =>
            createPlaceholderQuestion("Category 1", points),
          ),
        },
      ],
      teams: [],
      selectedTile: null,
      pointValues: POINT_VALUES,

      // Multiplayer state
      role: null,
      roomCode: null,
      buzzOrder: [],
      playerInformation: null,

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

            switch (true) {
              case newLen > currentLen:
                return {
                  ...cat,
                  questions: [
                    ...cat.questions,
                    ...pointValues
                      .slice(currentLen)
                      .map((points) =>
                        createPlaceholderQuestion(cat.name, points),
                      ),
                  ],
                };
              case newLen < currentLen:
                return {
                  ...cat,
                  questions: cat.questions.slice(0, newLen),
                };
              default:
                return cat;
            }
          }),
        })),
      // Multiplayer actions
      setRole: (role) => set({ role }),
      setRoomCode: (roomCode) => set({ roomCode }),
      addTeam: (team) =>
        set((state) => {
          if (state.teams.some((t) => t.id === team.id)) return state;
          return { teams: [...state.teams, team] };
        }),
      addBuzz: (entry) =>
        set((state) => {
          if (state.buzzOrder.some((b) => b.playerId === entry.playerId))
            return state;
          return { buzzOrder: [...state.buzzOrder, entry] };
        }),
      clearBuzzOrder: () => set({ buzzOrder: [] }),
      removeTeam: (id) =>
        set((state) => ({
          teams: state.teams.filter((t) => t.id !== id),
        })),
      setPlayerInformtion: (name: string, roomCode: string) => {
        set(() => ({
          playerInformation: {
            name,
            roomCode,
            id: crypto.randomUUID(),
          },
        }));
      },
      resetGame: () =>
        set((state) => ({
          gameState: "role-select",
          categories: state.categories.map((cat) => ({
            ...cat,
            questions: cat.questions.map((q) => ({ ...q, revealed: false })),
          })),
          teams: [],
          role: null,
          roomCode: null,
          buzzOrder: [],
        })),
    }),
    {
      name: "JEOPARDY_GAME_STATE",
      version: 1,
      migrate: (persisted: unknown, version: number) => {
        try {
          const state = persisted as Record<string, unknown>;
          if (version === 0 && Array.isArray(state.categories)) {
            state.categories = (
              state.categories as Array<{
                name: string;
                questions: Array<{
                  question: string | { text: string };
                  answer: string | { text: string };
                  revealed: boolean;
                }>;
              }>
            ).map((cat) => ({
              ...cat,
              questions: cat.questions.map((q) => ({
                question:
                  typeof q.question === "string"
                    ? { text: q.question }
                    : q.question,
                answer:
                  typeof q.answer === "string" ? { text: q.answer } : q.answer,
                revealed: q.revealed,
              })),
            }));
          }
          // Ensure all teams have an id (migration from pre-multiplayer)
          if (Array.isArray(state.teams)) {
            state.teams = (
              state.teams as Array<{ id?: string; name: string; score: number }>
            ).map((t) => ({
              ...t,
              id: t.id ?? crypto.randomUUID(),
            }));
          }

          return state as JeopardyStore;
        } catch {
          return undefined as unknown as JeopardyStore;
        }
      },
      partialize: (state) => ({
        gameState: state.gameState,
        categories: state.categories,
        teams: state.teams,
        pointValues: state.pointValues,
        role: state.role,
        roomCode: state.roomCode,
      }),
    },
  ),
);
