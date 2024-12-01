import * as fs from "fs";
import * as path from "path";

/**
 * Read input file for a specific day
 * @param day - The day number
 * @param isTest - Whether to read the test input (defaults to false)
 * @returns String contents of the input file
 */
export function readInput({
  day,
  isTest = false,
}: {
  day: number;
  isTest: boolean;
}): string {
  const fileName = isTest ? "test-input.txt" : "input.txt";
  const filePath = path.join(
    __dirname,
    `../days/day${day.toString().padStart(2, "0")}`,
    fileName
  );
  return fs.readFileSync(filePath, "utf-8").trim();
}
