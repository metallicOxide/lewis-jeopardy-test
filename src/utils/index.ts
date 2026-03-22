import type { Question } from "../types";

export const createPlaceholderQuestion = (
  categoryName: string,
  points: number,
): Question => ({
  question: `Question for ${categoryName} - ${points}`,
  answer: `Answer for ${categoryName} - ${points}`,
  revealed: false,
});
