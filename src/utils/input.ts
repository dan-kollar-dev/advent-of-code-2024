import * as fs from "fs";
import * as path from "path";

/**
 * Read input file for a specific day and part
 * @param day - The day number
 * @param isTest - Whether to read the test input (defaults to false)
 * @param part - The part number (defaults to undefined)
 * @returns String contents of the input file
 */
export function readInput({
  day,
  isTest = false,
  part,
}: {
  day: number;
  isTest: boolean;
  part?: number;
}): string {
  let fileName = 'input.txt';
  if (isTest) {
    fileName = `test-${fileName}`;
    if (part) {
      fileName = `part${part}-${fileName}`;
    }
  }

  const filePath = path.join(
    __dirname,
    `../days/day${day.toString().padStart(2, "0")}`,
    fileName
  );
  return fs.readFileSync(filePath, "utf-8").trim();
}
