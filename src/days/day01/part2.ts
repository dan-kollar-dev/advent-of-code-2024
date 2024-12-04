import { readInput } from "../../utils/input";

/**
 * Solves the second part of the day 1 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The total similarity score of the two lists
 * 
 * test-input.txt result: 31
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 1, isTest: useTestInput });
  const lines = input.split("\n");

  // Parse the input into two lists
  const list1 = [];
  const list2 = [];

  for (const line of lines) {
    const [id1, id2] = line.split(/\s+/);
    list1.push(parseInt(id1, 10));
    list2.push(parseInt(id2, 10));
  }

  // Calculate the total similarity score
  let totalSimilarityScore = 0;
  for (const item of list1) {
    const numOfOccurrences = list2.filter((id) => id === item).length;
    const similarityScore = Number(item) * numOfOccurrences;

    totalSimilarityScore += similarityScore;
  }

  // Return the total similarity score
  return totalSimilarityScore;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 2 Solution:", solve());
}

export default solve;
