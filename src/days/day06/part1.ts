import { readInput } from "../../utils/input";

/**
 * Solves the first part of the day 6 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The number of safe reports
 * 
 * test-input.txt result: ???
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 6, isTest: useTestInput });
  return 0;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
