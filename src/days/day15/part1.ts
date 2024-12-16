import { readInput } from "../../utils/input";

interface Coordinates {
  row: number;
  column: number;
}

let boxMap: Map<string, number> = new Map();
let MAP_HEIGHT: number;
let MAP_WIDTH: number;
let robotPosition: Coordinates;
let wallMap: Map<string, number> = new Map();

const moves: string[] = [];

/**
 * Parses the input into maps and a list of moves
 * @param input - The input to parse
 */
function parseInput(input: string): void {
  const [mapInput, movesInput] = input.split("\n\n");

  parseMapInput(mapInput);
  parseMovesInput(movesInput);
}

/**
 * Parses the map input into maps of walls and boxes
 * @param input - The map input to parse
 */
function parseMapInput(input: string) {
  MAP_HEIGHT = input.split("\n").length;
  MAP_WIDTH = input.split("\n")[0].length;

  let boxNumber = 1;
  let wallNumber = 1;
  input.split("\n").forEach((line, row) => {
    line.split("").forEach((char, column) => {
      if (char === ".") {
        return;
      }
      if (char === "#") {
        wallMap.set(`${row}-${column}`, wallNumber);
        wallNumber++;
        return;
      }
      if (char === "O") {
        boxMap.set(`${row}-${column}`, boxNumber);
        boxNumber++;
        return;
      }
      if (char === "@") {
        robotPosition = { row, column };
        return;
      }
      throw new Error(`Unknown character: ${char}`);
    });
  });
}

/**
 * Parses the moves input into a list of moves
 * @param input - The moves input to parse
 */
function parseMovesInput(input: string) {
  let strippedInput = input.replace(/\s/g, "");
  moves.push(...strippedInput);
}

/**
 * Gets the next position
 * @param position - The current position
 * @param move - The move to make
 * @returns The next position
 */
function getNextPosition(position: Coordinates, move: string): Coordinates {
  if (move === "^") {
    return { row: position.row - 1, column: position.column };
  }
  if (move === "v") {
    return { row: position.row + 1, column: position.column };
  }
  if (move === "<") {
    return { row: position.row, column: position.column - 1 };
  }
  if (move === ">") {
    return { row: position.row, column: position.column + 1 };
  }
  throw new Error(`Unknown move: ${move}`);
}

/**
 * Moves the robot
 * @param move - The move to make
 */
function moveRobot(move: string) {
  const { row: nextRow, column: nextColumn } = getNextPosition(
    robotPosition,
    move
  );
  // If the next position is a wall, we can't move
  if (wallMap.has(`${nextRow}-${nextColumn}`)) {
    return;
  }

  // If the next position is a box, move the robot and the boxes if there is space
  if (boxMap.has(`${nextRow}-${nextColumn}`)) {
    // Initialize the list of boxes to move with the box at the next position
    const boxesToMove: { coordinates: Coordinates; boxNumber: number }[] = [
      {
        coordinates: { row: nextRow, column: nextColumn },
        boxNumber: boxMap.get(`${nextRow}-${nextColumn}`)!,
      },
    ];
    let hasSpace = false;
    let searching = true;
    let nextPosition = getNextPosition(
      { row: nextRow, column: nextColumn },
      move
    );
    while (searching) {
      // If the next position is a wall, we can't move
      if (wallMap.has(`${nextPosition.row}-${nextPosition.column}`)) {
        searching = false;
        continue;
      }
      // If the next position is a box, add it to the list of boxes to move
      if (boxMap.has(`${nextPosition.row}-${nextPosition.column}`)) {
        boxesToMove.unshift({
          coordinates: nextPosition,
          boxNumber: boxMap.get(`${nextPosition.row}-${nextPosition.column}`)!,
        });
        nextPosition = getNextPosition(nextPosition, move);
        continue;
      }
      // If the next position is empty, we can move
      hasSpace = true;
      searching = false;
    }
    if (hasSpace) {
      // Move the robot and the boxes
      robotPosition = { row: nextRow, column: nextColumn };
      boxesToMove.forEach((box) => {
        const { boxNumber, coordinates } = box;
        boxMap.delete(`${coordinates.row}-${coordinates.column}`);
        const nextBoxPosition = getNextPosition(coordinates, move);
        boxMap.set(
          `${nextBoxPosition.row}-${nextBoxPosition.column}`,
          boxNumber
        );
      });
    }
    return;
  }

  // If the next position is empty, move the robot
  robotPosition = { row: nextRow, column: nextColumn };
}

/**
 * Logs the map based on walls and the current state of the robot and boxes
 */
function logMap() {
  const map: string[][] = Array.from({ length: MAP_HEIGHT }, () =>
    Array.from({ length: MAP_WIDTH }, () => ".")
  );
  for (let row = 0; row < MAP_HEIGHT; row++) {
    for (let column = 0; column < MAP_WIDTH; column++) {
      if (robotPosition.row === row && robotPosition.column === column) {
        map[row][column] = "@";
      } else if (boxMap.has(`${row}-${column}`)) {
        map[row][column] = "O";
      } else if (wallMap.has(`${row}-${column}`)) {
        map[row][column] = "#";
      }
    }
  }
  console.table(map);
}

/**
 * Gets the sum of all boxes' GPS coordinates
 * @returns The sum of all boxes' GPS coordinates
 */
function getSumOfBoxCoordinates(): number {
  let sum = 0;
  for (const [key, _] of boxMap.entries()) {
    const [row, column] = key.split("-").map(Number);
    sum += row * 100 + column;
  }
  return sum;
}

/**
 * Solves the first part of the day 15 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The sum of all boxes' GPS coordinates
 *
 * test-input.txt result: 10092
 * test-input2.txt result: 2028
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 15, isTest: useTestInput });

  parseInput(input);

  let move = moves.shift();
  while (move) {
    moveRobot(move);
    move = moves.shift();
  }
  
  const sumOfBoxCoordinates = getSumOfBoxCoordinates();

  return sumOfBoxCoordinates;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
