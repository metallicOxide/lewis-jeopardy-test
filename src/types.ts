export type GameState = {
    gameStatus?: GameStatus;
    category?: Category[];
    teams?: Team[];
    questions?: Question[]
}

export const STATE_KEY = {
    GAME_STATUS: 'gameStatus',
    CATEGORY: 'category',
    QUESTIONS: 'questions',
    TEAMS: 'teams',
} as const

export type Question = {
    question: string;
    answer: string;
    revealed: boolean;
}

export type Category = {
    name: string;
    questions: Question[];
}

export type Team = {
    name: string;
    score: number;
}

export type GameStatus = 'start' | 'config' | 'board' | 'question';