import { readInput } from "../../utils/input";

/**
 * Solves the first part of the day 2 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The number of safe reports
 * 
 * test-input.txt result: 2
 * input.txt result: 502
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 2, isTest: useTestInput });
  const reports = input.split("\n");

  let numSafeReports = 0;

  for (const report of reports) {
    const levels = report.split(/\s+/).map(Number);

    let isIncreasing = undefined;
    let isSafe = true;
    let index = 0;
    while (isSafe && index < levels.length - 1) {
      const first = levels[index];
      const second = levels[index + 1];

      if (isIncreasing === undefined) {
        isIncreasing = first < second;
      }

      // The levels must be either all increasing or all decreasing.
      if (isIncreasing && first > second) {
        isSafe = false;
      } else if (!isIncreasing && first < second) {
        isSafe = false;
      }

      const diff = Math.abs(first - second);

      // Any two adjacent levels must differ by at least one and at most three.
      if (diff < 1 || diff > 3) {
        isSafe = false;
      }

      index += 1;
    }

    if (isSafe) {
      numSafeReports++;
    }
  }

  // Return the number of safe reports
  return numSafeReports;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
