import Papa from "papaparse";

import { Question, Category } from "../types";
import { createPlaceholderQuestion } from "../utils";
import { CSVRow, validateCSV, isRowValid, derivePointValues } from "./util";

const parseCSVData = (
  results: Papa.ParseResult<CSVRow>,
): { categories: Category[]; pointValues: number[] } => {
  const categoryMap = new Map<
    string,
    { points: number; question: Question }[]
  >();

  results.data.forEach((row, index) => {
    if (!isRowValid(row, index)) {
      return;
    }

    const categoryName = row.Category.trim();
    const points = parseInt(row.Points);

    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, []);
    }

    categoryMap.get(categoryName)!.push({
      points,
      question: {
        question: row.Question.trim(),
        answer: row.Answer.trim(),
        revealed: false,
      },
    });
  });

  if (categoryMap.size === 0) {
    throw new Error("No valid categories found in CSV");
  }

  const pointValues = derivePointValues(categoryMap);

  const categories: Category[] = Array.from(categoryMap.entries()).map(
    ([categoryName, rows]) => ({
      name: categoryName,
      questions: pointValues.map((pv) => {
        const match = rows.find((r) => r.points === pv);
        return match?.question || createPlaceholderQuestion(categoryName, pv);
      }),
    }),
  );

  return { categories, pointValues };
};

export const importQuestionsFromCSV = (
  file: File,
): Promise<{ categories: Category[]; pointValues: number[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        try {
          validateCSV(results);
          resolve(parseCSVData(results));
        } catch (error) {
          reject(
            new Error(
              `Failed to parse CSV: ${error instanceof Error ? error.message : "Unknown error"}`,
            ),
          );
        }
      },
      error: (error) => {
        reject(new Error(`Failed to read CSV file: ${error.message}`));
      },
    });
  });
};
