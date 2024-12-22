import { readInput } from "../../utils/input";

const availableTowelPatternsArray: string[] = [];
const desiredPatterns: string[] = [];
const invalidPatterns: Map<string, boolean> = new Map();
const patternCounts: Map<string, number> = new Map();

/**
 * Parses the input into the available towel patterns and desired patterns
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
 * Gets the possible patterns
 * @returns The possible patterns
 */
function getPossiblePatterns(): string[] {
  const possiblePatterns: string[] = [];
  for (const pattern of desiredPatterns) {
    if (!isPossible(pattern)) {
      invalidPatterns.set(pattern, true);
      continue;
    }
    possiblePatterns.push(pattern);
  }
  return possiblePatterns;
}

/**
 * Gets the possible pattern count for a pattern
 * @param available - The available patterns
 * @param pattern - The pattern to count
 * @returns The possible pattern count
 */
function getPossiblePatternCountForPattern({
  available,
  pattern,
}: {
  available: string[];
  pattern: string;
}): number {
  if (pattern.length === 0) {
    return 1;
  }

  // Get the next available patterns
  const nextAvailableArray = available.filter((a) => {
    return pattern.startsWith(a);
  });

  // If there are no available patterns, return 0
  if (nextAvailableArray.length === 0) {
    return 0;
  }

  // If the pattern is invalid, return 0
  if (invalidPatterns.has(pattern)) {
    return 0;
  }

  // Count the number of possible patterns
  let totalCount = 0;
  for (const nextAvailable of nextAvailableArray) {
    const remainingPattern = pattern.slice(nextAvailable.length);

    // If the pattern is invalid, skip it
    if (invalidPatterns.has(remainingPattern)) {
      continue;
    }

    // If the pattern has already been counted, add the count to the total
    if (patternCounts.has(remainingPattern)) {
      totalCount += patternCounts.get(remainingPattern)!;
      continue;
    }

    // If the pattern has not been counted yet, count it
    let count = getPossiblePatternCountForPattern({
      available,
      pattern: remainingPattern,
    });

    // If the pattern has no possible patterns, mark it as invalid
    if (count === 0) {
      invalidPatterns.set(remainingPattern, true);
      continue;
    }

    // If the pattern has possible patterns, add the count to the total
    patternCounts.set(remainingPattern, count);
    totalCount += count;
  }

  // If the pattern has no possible patterns, mark it as invalid
  if (totalCount === 0) {
    invalidPatterns.set(pattern, true);
  }

  // If the pattern is possible, add it to the pattern counts
  if (totalCount > 0) {
    patternCounts.set(pattern, totalCount);
  }

  return totalCount;
}

/**
 * Solves the second part of the day 19 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The sum of the number of different ways you could make each design
 *
 * test-input.txt result: 16
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 19, isTest: useTestInput });

  parseInput(input);

  const possiblePatterns = getPossiblePatterns();

  let possibleWaysCount = 0;
  for (const pattern of possiblePatterns) {
    const available = availableTowelPatternsArray.filter((a) =>
      pattern.includes(a)
    );

    const possiblePatterns = getPossiblePatternCountForPattern({
      available,
      pattern,
    });

    possibleWaysCount += possiblePatterns;
  }

  return possibleWaysCount;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 2 Solution:", solve());
}

export default solve;
