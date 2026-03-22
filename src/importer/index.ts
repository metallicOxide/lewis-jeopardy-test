// csvImporter.ts
import Papa from "papaparse";

import { Question, Category } from "../types";

interface CSVRow {
  Category: string;
  Number: string;
  Question: string;
  Answer: string;
}

export const importQuestionsFromCSV = (
  file: File,
  pointValues: number[],
): Promise<Category[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        try {
          // Validate data
          if (!results.data || results.data.length === 0) {
            reject(new Error("CSV file is empty"));
            return;
          }

          // Check for required columns
          const requiredColumns = ["Category", "Number", "Question", "Answer"];
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

          // Group questions by category
          const categoryMap = new Map<string, Map<number, Question>>();

          results.data.forEach((row, index) => {
            // Validate row data
            if (
              !row.Category ||
              row.Question === undefined ||
              row.Answer === undefined
            ) {
              console.warn(`Skipping row ${index + 1}: Missing required data`);
              return;
            }

            const categoryName = row.Category.trim();
            const questionNumber = parseInt(row["Number"]);

            if (
              isNaN(questionNumber) ||
              questionNumber < 0 ||
              questionNumber >= pointValues.length
            ) {
              console.warn(
                `Skipping row ${index + 1}: Invalid Number ${row["Number"]}`,
              );
              return;
            }

            const question: Question = {
              question: row.Question.trim(),
              answer: row.Answer.trim(),
              revealed: false,
            };

            // Initialize category map if needed
            if (!categoryMap.has(categoryName)) {
              categoryMap.set(categoryName, new Map());
            }

            // Add question to category
            categoryMap.get(categoryName)!.set(questionNumber, question);
          });

          // Convert map to Category array
          const categories: Category[] = Array.from(categoryMap.entries()).map(
            ([categoryName, questionsMap]) => {
              // Create questions array with all slots filled
              const questions: Question[] = pointValues.map((points, index) => {
                const existingQuestion = questionsMap.get(index);
                return (
                  existingQuestion || {
                    question: `Question for ${categoryName} - ${points}`,
                    answer: `Answer for ${categoryName} - ${points}`,
                    revealed: false,
                  }
                );
              });

              return {
                name: categoryName,
                questions,
              };
            },
          );

          if (categories.length === 0) {
            reject(new Error("No valid categories found in CSV"));
            return;
          }

          resolve(categories);
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
