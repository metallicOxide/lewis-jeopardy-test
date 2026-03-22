import Papa from "papaparse";

import { Question, Category } from "../types";
import { createPlaceholderQuestion } from "../utils";

interface CSVRow {
  Category: string;
  Points: string;
  Question: string;
  Answer: string;
}

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
          if (!results.data || results.data.length === 0) {
            reject(new Error("CSV file is empty"));
            return;
          }

          const requiredColumns = ["Category", "Points", "Question", "Answer"];
          const headers = results.meta.fields || [];
          const missingColumns = requiredColumns.filter(
            (col) => !headers.includes(col),
          );

          if (missingColumns.length > 0) {
            reject(
              new Error(
                `Missing required columns: ${missingColumns.join(", ")}`,
              ),
            );
            return;
          }

          // Group rows by category, collecting points per row
          const categoryMap = new Map<
            string,
            { points: number; question: Question }[]
          >();

          results.data.forEach((row, index) => {
            if (
              !row.Category ||
              row.Question === undefined ||
              row.Answer === undefined ||
              row.Points === undefined
            ) {
              console.warn(`Skipping row ${index + 1}: Missing required data`);
              return;
            }

            const categoryName = row.Category.trim();
            const points = parseInt(row.Points);

            if (isNaN(points)) {
              console.warn(
                `Skipping row ${index + 1}: Invalid Points value "${row.Points}"`,
              );
              return;
            }

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
            reject(new Error("No valid categories found in CSV"));
            return;
          }

          // Find the category with the most rows and derive pointValues from it
          let maxRows = 0;
          let maxCategoryPoints: number[] = [];

          categoryMap.forEach((rows) => {
            const uniquePoints = [
              ...new Set(rows.map((r) => r.points)),
            ].sort((a, b) => a - b);
            if (uniquePoints.length > maxRows) {
              maxRows = uniquePoints.length;
              maxCategoryPoints = uniquePoints;
            }
          });

          const pointValues = maxCategoryPoints;

          // Build categories using derived pointValues
          const categories: Category[] = Array.from(
            categoryMap.entries(),
          ).map(([categoryName, rows]) => {
            const questions: Question[] = pointValues.map((pv) => {
              const match = rows.find((r) => r.points === pv);
              return match?.question || createPlaceholderQuestion(categoryName, pv);
            });

            return {
              name: categoryName,
              questions,
            };
          });

          resolve({ categories, pointValues });
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
