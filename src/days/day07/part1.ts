import { readInput } from "../../utils/input";

/**
 * Determines if a given value can be produced by adding or multiplying the numbers in the array
 * @param testValue - The value to test against
 * @param currentValue - The current value to test against the test value
 * @param numbers - The numbers to add or multiply
 * @returns Whether the test value can be produced
 */
function canProduceTestValue({
  testValue,
  currentValue,
  numbers,
}: {
  testValue: number;
  currentValue: number;
  numbers: number[];
}): boolean {
  if (currentValue > testValue) {
    return false;
  }

  if (numbers.length === 0) {
    return currentValue === testValue;
  }

  const [first, ...rest] = numbers;

  return (
    canProduceTestValue({
      testValue,
      currentValue: currentValue + first,
      numbers: rest,
    }) ||
    canProduceTestValue({
      testValue,
      currentValue: currentValue * first,
      numbers: rest,
    })
  );
}

/**
 * Solves the first part of the day 7 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The total calibration result
 *
 * test-input.txt result: 3749
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 7, isTest: useTestInput });

  const equations = input.split("\n");

  let totalCalibrationResult = 0;

  for (const equation of equations) {
    const [testValueString, numbersString] = equation.split(": ");
    const testValue = parseInt(testValueString);
    const numbers = numbersString.split(" ").map(Number);

    if (canProduceTestValue({ testValue, currentValue: 0, numbers })) {
      totalCalibrationResult += testValue;
    }
  }

  return totalCalibrationResult;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
