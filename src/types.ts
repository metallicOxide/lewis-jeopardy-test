export type MediaType = "image" | "youtube";

export type Media = {
  type: MediaType;
  url: string;
};

export type QuestionSide = {
  text: string;
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
  name: string;
  score: number;
};

export type GameStatus = "start" | "config" | "board" | "question";
