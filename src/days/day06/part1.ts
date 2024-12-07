import { readInput } from "../../utils/input";

let grid: string[][];
let guardPosition: [number, number];
let guardSymbol: string;
let isComplete: boolean = false;
let numberOfPositionsVisited: number = 0;

/**
 * Initializes the grid from the input
 * @param input - The input string
 */
function initializeGrid(input: string): void {
  grid = input.split("\n").map((row) => row.split(""));
}

/**
 * Initializes the guard position
 */
function initializeGuardPosition(): void {
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      if (["^", "v", ">", "<"].includes(grid[row][column])) {
        guardPosition = [row, column];
        guardSymbol = grid[row][column];
      }
    }
  }
}

/**
 * Gets the next position of the guard given the current position and direction
 * @returns The next position of the guard
 */
function getNextPosition(): [number, number] {
  const [row, column] = guardPosition;
  switch (guardSymbol) {
    case "^":
      return [row - 1, column];
    case "v":
      return [row + 1, column];
    case ">":
      return [row, column + 1];
    case "<":
      return [row, column - 1];
    default:
      throw new Error(`Invalid guard symbol: ${guardSymbol}`);
  }
}

/**
 * Turns the guard to the next direction
 */
function turnGuard(): void {
  switch (guardSymbol) {
    case "^":
      guardSymbol = ">";
      break;
    case "v":
      guardSymbol = "<";
      break;
    case ">":
      guardSymbol = "v";
      break;
    case "<":
      guardSymbol = "^";
      break;
    default:
      throw new Error(`Invalid guard symbol: ${guardSymbol}`);
  }
}

/**
 * Moves the guard to the next position or turns the guard if it hits an obstruction
 */
function moveGuard(): void {
  const [row, column] = guardPosition;
  const [nextRow, nextColumn] = getNextPosition();
  const nextSymbol = grid[nextRow]?.[nextColumn] ?? undefined;

  // If the next position is an obstruction, turn the guard
  if (nextSymbol === "#") {
    turnGuard();
    return;
  }

  // Mark the current position as visited if it hasn't been already
  if (grid[row][column] !== "X") {
    grid[row][column] = "X";
    numberOfPositionsVisited++;
  }

  // Move the guard to the next position
  guardPosition = [nextRow, nextColumn];

  // If the next position is undefined, the guard has left the mapped area
  if (nextSymbol === undefined) {
    isComplete = true;
  }
}

/**
 * Solves the first part of the day 6 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The number of positions visited by the guard before leaving the mapped area
 *
 * test-input.txt result: 41
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 6, isTest: useTestInput });
  
  initializeGrid(input);
  initializeGuardPosition();

  while (!isComplete) {
    moveGuard();
  }
  
  return numberOfPositionsVisited;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
