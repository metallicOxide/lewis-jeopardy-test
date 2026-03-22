export type Question = {
  question: string;
  answer: string;
  revealed: boolean;
};

export type Category = {
  name: string;
  questions: Question[];
};

export type Team = {
  name: string;
  score: number;
};

export type GameStatus = "start" | "config" | "board" | "question";
