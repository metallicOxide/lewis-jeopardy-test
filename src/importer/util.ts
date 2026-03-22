import Papa from "papaparse";

import { Question } from "../types";

export interface CSVRow {
  Category: string;
  Points: string;
  Question: string;
  Answer: string;
}

const REQUIRED_COLUMNS = ["Category", "Points", "Question", "Answer"];

export const validateCSV = (results: Papa.ParseResult<CSVRow>): void => {
  if (!results.data || results.data.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headers = results.meta.fields || [];
  const missingColumns = REQUIRED_COLUMNS.filter(
    (col) => !headers.includes(col),
  );

  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
  }
};

export const isRowValid = (row: CSVRow, rowIndex: number): boolean => {
  const valid =
    !!row.Category &&
    row.Question !== undefined &&
    row.Answer !== undefined &&
    row.Points !== undefined;

  if (!valid) {
    console.warn(`Skipping row ${rowIndex + 1}: Missing or invalid data`);
  }

  if (isNaN(parseInt(row.Points))) {
    console.warn(
      `Skipping row ${rowIndex + 1}: Invalid Points value "${row.Points}"`,
    );
  }

  return valid;
};

export const derivePointValues = (
  categoryMap: Map<string, { points: number; question: Question }[]>,
): number[] => {
  let maxRows = 0;
  let maxCategoryPoints: number[] = [];

  categoryMap.forEach((rows) => {
    const uniquePoints = [...new Set(rows.map((r) => r.points))].sort(
      (a, b) => a - b,
    );
    if (uniquePoints.length > maxRows) {
      maxRows = uniquePoints.length;
      maxCategoryPoints = uniquePoints;
    }
  });

  return maxCategoryPoints;
};
