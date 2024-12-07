import { readInput } from "../../utils/input";

let guardPosition: [number, number];
let guardSymbol: string;
let isComplete: boolean = false;
let isLoop: boolean = false;
let starterGrid: string[][];
let starterGridGuardPosition: [number, number];
let starterGridGuardSymbol: string;

/**
 * Initializes the grid from the input
 * @param input - The input string
 */
function initializeGrid(input: string): void {
  starterGrid = input.split("\n").map((row) => row.split(""));
}

/**
 * Initializes the guard position
 */
function initializeGuardPosition(): void {
  for (let row = 0; row < starterGrid.length; row++) {
    for (let column = 0; column < starterGrid[row].length; column++) {
      if (["^", "v", ">", "<"].includes(starterGrid[row][column])) {
        starterGridGuardPosition = [row, column];
        starterGridGuardSymbol = starterGrid[row][column];
      }
    }
  }
}

/**
 * Resets the guard position, guard symbol, and flags
 */
function resetState(): void {
  guardPosition = starterGridGuardPosition;
  guardSymbol = starterGridGuardSymbol;
  isComplete = false;
  isLoop = false;
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
 * @param grid - The grid to move the guard on
 */
function moveGuard(grid: string[][]): void {
  const [row, column] = guardPosition;
  const [nextRow, nextColumn] = getNextPosition();
  const nextSymbol = grid[nextRow]?.[nextColumn] ?? undefined;
  const currentPositionSymbol = grid[row]?.[column];

  // If current position would repeat, set the loop flag
  if (currentPositionSymbol.includes(guardSymbol)) {
    isLoop = true;
    return;
  }

  // If the next position is undefined, the guard has left the mapped area
  if (nextSymbol === undefined) {
    isComplete = true;
    return;
  }

  grid[row][column] += guardSymbol;

  // If the next position is an obstruction, turn the guard
  if (nextSymbol === "#") {
    turnGuard();
    return;
  }

  // Move the guard to the next position
  guardPosition = [nextRow, nextColumn];
}

/**
 * Gets the number of positions where a new obstruction causes the guard to loop
 * @returns The number of positions where a new obstruction causes the guard to loop
 */
function getLoopingObstructionCount(): number {
  let loopingObstructionCount: number = 0;

  // Iterate through each position in the grid
  for (let row = 0; row < starterGrid.length; row++) {
    for (let column = 0; column < starterGrid[row].length; column++) {
      // If the position is empty, add an obstruction and test if it loops
      if (starterGrid[row][column] === ".") {
        // Reset globals
        resetState();

        // Create a copy of the grid
        let copiedGrid: string[][] = [...starterGrid].map((row) => [...row]);
        const [starterGridGuardRow, starterGridGuardColumn] =
          starterGridGuardPosition;

        // Reset guard symbol
        copiedGrid[starterGridGuardRow][starterGridGuardColumn] = ".";

        // Add an obstruction
        copiedGrid[row][column] = "#";

        // Move the guard until it either completes or loops
        while (!isComplete && !isLoop) {
          moveGuard(copiedGrid);
        }

        // If the guard loops, increment the obstruction count
        if (isLoop) {
          loopingObstructionCount++;
        }
      }
    }
  }

  return loopingObstructionCount;
}

/**
 * Solves the second part of the day 6 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The number of positions to add an obstruction to so that the guard loops
 *
 * test-input.txt result: 6
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 6, isTest: useTestInput });

  initializeGrid(input);
  initializeGuardPosition();

  const loopingObstructionCount = getLoopingObstructionCount();

  return loopingObstructionCount;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
