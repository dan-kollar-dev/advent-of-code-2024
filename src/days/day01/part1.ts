import { readInput } from "../../utils/input";

/**
 * Solves the first part of the day 1 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The total distance between the two lists
 * 
 * test-input.txt result: 11
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

  // Sort the lists
  list1.sort((a, b) => a - b);
  list2.sort((a, b) => a - b);

  // Calculate the total distance
  let totalDistance = 0;
  for (let i = 0, len = list1.length; i < len; i++) {
    const item1 = list1[i];
    const item2 = list2[i];

    const distanceApart = Math.abs(item1 - item2);

    totalDistance += distanceApart;
  }

  // Return the total distance
  return totalDistance;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
