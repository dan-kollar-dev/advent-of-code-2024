import { readInput } from "../../utils/input";

/**
 * Solves the first part of the day 4 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The number of safe reports
 * 
 * test-input.txt result: 18
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 4, isTest: useTestInput });
  return 0;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;