import type { Question } from "../types";

export const createPlaceholderQuestion = (
  categoryName: string,
  points: number,
): Question => ({
  question: { text: `Question for ${categoryName} - ${points}` },
  answer: { text: `Answer for ${categoryName} - ${points}` },
  revealed: false,
});

export const getYouTubeEmbedUrl = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};
