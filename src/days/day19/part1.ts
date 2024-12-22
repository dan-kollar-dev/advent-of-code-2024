import { readInput } from "../../utils/input";

const desiredPatterns: string[] = [];
const availableTowelPatternsArray: string[] = [];

/**
 * Parses the input into the desired patterns and available towel patterns
 * @param input - The input to parse
 */
function parseInput(input: string): void {
  const [availableTowelPatternsInput, desiredDesignsInput] =
    input.split("\n\n");

  for (const pattern of availableTowelPatternsInput.split(", ")) {
    availableTowelPatternsArray.push(pattern);
  }

  for (const pattern of desiredDesignsInput.split("\n")) {
    desiredPatterns.push(pattern);
  }
}

/**
 * Checks if a pattern is possible
 * @param pattern - The pattern to check
 * @returns Whether the pattern is possible
 */
function isPossible(pattern: string): boolean {
  const regex = new RegExp(
    `^(${availableTowelPatternsArray
      .map((pattern) => pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})+$`
  );
  return regex.test(pattern);
}

/**
 * Solves the first part of the day 19 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The number of possible designs
 *
 * test-input.txt result: 6
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 19, isTest: useTestInput });

  parseInput(input);

  let possibleDesigns = 0;
  for (const pattern of desiredPatterns) {
    if (isPossible(pattern)) {
      possibleDesigns++;
    }
  }

  return possibleDesigns;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
