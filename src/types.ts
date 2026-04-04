export type MediaType = "image" | "youtube";

export type Media = {
  type: MediaType;
  url: string;
  uploaded?: boolean;
};

export type QuestionSide = {
  text?: string;
  media?: Media;
};

export type Question = {
  question: QuestionSide;
  answer: QuestionSide;
  revealed: boolean;
};

export type Category = {
  name: string;
  questions: Question[];
};

export type Team = {
  id: string;
  name: string;
  score: number;
};

export type Role = "host" | "player" | null;

export type BuzzEntry = {
  playerId: string;
  receivedAt: number;
};

export type GameStatus = "role-select" | "start" | "config" | "board" | "question";
