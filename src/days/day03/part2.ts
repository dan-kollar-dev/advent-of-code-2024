import { readInput } from "../../utils/input";

/**
 * Solves the second part of the day 3 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The sum of the multiplication results
 *
 * part2-test-input.txt result: 48
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 3, isTest: useTestInput, part: 2 });

  // Regex to match the instructions
  const instructionsRegex = /mul\((\d{1,3}),\s*(\d{1,3})\)|do\(\)|don['’]t\(\)/g;
  const instructions = input.match(instructionsRegex) ?? [];

  // Sum of the multiplication results
  let sum = 0;
  let isEnabled = true;

  for (const instruction of instructions) {
    if (instruction === "do()") {
      isEnabled = true;
      continue;
    }

    if (instruction === "don't()") {
      isEnabled = false;
      continue;
    }

    if (!isEnabled) {
      continue;
    }

    const numbersRegex = /(\d{1,3}),(\d{1,3})/;
    const numbers = instruction.match(numbersRegex);
    const a = parseInt(numbers?.[1] ?? "0");
    const b = parseInt(numbers?.[2] ?? "0");
    const multiplicationResult = a * b;
    sum += multiplicationResult;
  }

  return sum;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
