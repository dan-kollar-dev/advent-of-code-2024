import { readInput } from "../../utils/input";
import { getFactors } from "../../utils/number";
interface Coordinates {
  x: number;
  y: number;
}

interface Machine {
  buttonA: Coordinates;
  buttonB: Coordinates;
  prize: Coordinates;
}

const A_PRESS_COST = 3;
const B_PRESS_COST = 1;

/**
 * Parses the input string to get the coordinates
 * @param input - The input string
 * @returns The coordinates provided by the input
 */
function getInputCoordinates(input: string): [number, number] {
  const matches = input.match(/\d+/g);
  return matches ? [parseInt(matches[0]), parseInt(matches[1])] : [-1, -1];
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
    return {
      buttonA: { x: Number(buttonA_x), y: Number(buttonA_y) },
      buttonB: { x: Number(buttonB_x), y: Number(buttonB_y) },
      prize: { x: Number(prize_x), y: Number(prize_y) },
    };
  });
}

/**
 * Finds the number of tokens needed to win a machine
 * @param machine - The machine to find the tokens for
 * @returns The number of tokens needed to win the machine or 0 if it's not possible
 */
function findTokensNeeded(machine: Machine): number {
  const { x: xPrize, y: yPrize } = machine.prize;
  const { x: buttonA_x, y: buttonA_y } = machine.buttonA;
  const { x: buttonB_x, y: buttonB_y } = machine.buttonB;

  for (let i = 0; i <= 100; i++) {
    if ((i * buttonA_x <= xPrize) && (xPrize - (i * buttonA_x)) % buttonB_x === 0) {
      const buttonAPresses = i;
      const buttonBPresses = (xPrize - (i * buttonA_x)) / buttonB_x;

      if (buttonAPresses * buttonA_y + buttonBPresses * buttonB_y === yPrize) {
        const totalTokens = buttonAPresses * A_PRESS_COST + buttonBPresses * B_PRESS_COST;
        return totalTokens;
      }
    }
  }

  return 0;
}

/**
 * Solves the first part of the day 13 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The fewest number of tokens to spend to win all possible prizes
 *
 * test-input.txt result: 480
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 13, isTest: useTestInput });
  
  const machines = generateMachines(input);

  let totalTokens = 0;
  for (const machine of machines) {
    totalTokens += findTokensNeeded(machine);
  }

  return totalTokens;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
