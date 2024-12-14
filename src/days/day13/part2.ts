import BigNumber from "bignumber.js";
import { readInput } from "../../utils/input";
import { getFactors, roundToDecimals } from "../../utils/number";
interface Coordinates {
  x: BigNumber;
  y: BigNumber;
}

interface Line {
  slope: BigNumber;
  yIntercept: BigNumber;
}

interface Machine {
  buttonA: Coordinates;
  buttonB: Coordinates;
  prize: Coordinates;
}

const A_PRESS_COST = new BigNumber(3);
const B_PRESS_COST = new BigNumber(1);

/**
 * Parses the input string to get the coordinates
 * @param input - The input string
 * @returns The coordinates provided by the input
 */
function getInputCoordinates(input: string): [BigNumber, BigNumber] {
  const matches = input.match(/\d+/g);
  return matches
    ? [new BigNumber(matches[0]), new BigNumber(matches[1])]
    : [new BigNumber(-1), new BigNumber(-1)];
}

/**
 * Generates the machines from the input string
 * @param input - The input string
 * @returns The machines provided by the input
 */
function generateMachines(input: string): Machine[] {
  return input.split("\n\n").map((machineInput) => {
    const [buttonAInput, buttonBInput, prizeInput] = machineInput.split("\n");
    const [buttonA_x, buttonA_y] = getInputCoordinates(buttonAInput);
    const [buttonB_x, buttonB_y] = getInputCoordinates(buttonBInput);
    const [prize_x, prize_y] = getInputCoordinates(prizeInput);
    const additionalX = new BigNumber(10000000000000);
    const additionalY = new BigNumber(10000000000000);
    return {
      buttonA: { x: buttonA_x, y: buttonA_y },
      buttonB: { x: buttonB_x, y: buttonB_y },
      prize: {
        x: prize_x.plus(additionalX),
        y: prize_y.plus(additionalY),
      },
    };
  });
}

/**
 * Finds the intersection of two lines
 * @param lineA - The first line
 * @param lineB - The second line
 * @returns The intersection of the two lines or null if they don't intersect
 */
function findIntersection(
  lineA: Line,
  lineB: Line
): { x: BigNumber; y: BigNumber } | null {
  if (lineA.slope === lineB.slope) {
    return null; // No intersection
  }

  // Calculate x coordinate of the intersection
  const x = lineB.yIntercept
    .minus(lineA.yIntercept)
    .dividedBy(lineA.slope.minus(lineB.slope));

  // Calculate y coordinate using one of the line equations
  const y = lineB.slope.times(x).plus(lineB.yIntercept); // or use m2 * x + b2

  return { x, y };
}

/**
 * Finds the number of tokens needed to win a machine
 * @param machine - The machine to find the tokens for
 * @returns The number of tokens needed to win the machine or 0 if it's not possible
 */
function findTokensNeeded(machine: Machine): BigNumber {
  const xPrize = machine.prize.x;
  const yPrize = machine.prize.y;
  const { x: buttonA_x, y: buttonA_y } = machine.buttonA;
  const { x: buttonB_x, y: buttonB_y } = machine.buttonB;

  // Set up line A to intersect with origin
  const lineASlope = buttonA_y.dividedBy(buttonA_x);
  const lineA = {
    slope: lineASlope,
    yIntercept: new BigNumber(0),
  };

  // Set up line B to intersect with the prize point
  const lineBSlope = buttonB_y.dividedBy(buttonB_x);
  const lineBIntercept = yPrize.minus(lineBSlope.times(xPrize));
  const lineB = {
    slope: lineBSlope,
    yIntercept: lineBIntercept,
  };

  // Get the intersection of the two lines
  const intersection = findIntersection(lineA, lineB);

  if (!intersection) {
    return new BigNumber(0);
  }

  // Check if the intersection is within the x bounds of the prize
  if (
    intersection.x.isLessThan(new BigNumber(0)) ||
    intersection.x.isGreaterThan(xPrize)
  ) {
    return new BigNumber(0);
  }

  // Check if the intersection is within the y bounds of the prize
  if (
    intersection.y.isLessThan(new BigNumber(0)) ||
    intersection.y.isGreaterThan(yPrize)
  ) {
    return new BigNumber(0);
  }

  // Calculate the number of times button A and button B need to be pressed
  const buttonA_times = intersection.x.dividedBy(buttonA_x);
  const buttonB_times = xPrize
    .minus(buttonA_x.times(buttonA_times))
    .dividedBy(buttonB_x);

  // Check if the number of times button A needs to be pressed is an integer within tolerance to account for floating point precision
  if (
    !buttonA_times
      .minus(buttonA_times.integerValue())
      .abs()
      .isLessThanOrEqualTo(new BigNumber(0.001))
  ) {
    return new BigNumber(0);
  }

  // Check if the number of times button B needs to be pressed is an integer within tolerance to account for floating point precision
  if (
    !buttonB_times
      .minus(buttonB_times.integerValue())
      .abs()
      .isLessThanOrEqualTo(new BigNumber(0.001))
  ) {
    return new BigNumber(0);
  }

  // Calculate the number of tokens needed to win the machine
  const aTokens = buttonA_times.times(A_PRESS_COST);
  const bTokens = buttonB_times.times(B_PRESS_COST);
  const tokens = aTokens.plus(bTokens);

  return tokens;
}

/**
 * Solves the second part of the day 13 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The fewest number of tokens to spend to win all possible prizes
 *
 * test-input.txt result: 875318608908
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): string {
  const input = readInput({ day: 13, isTest: useTestInput });

  const machines = generateMachines(input);

  let totalTokens = new BigNumber(0);
  for (const machine of machines) {
    totalTokens = totalTokens.plus(findTokensNeeded(machine));
  }

  return totalTokens.integerValue().toString();
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
