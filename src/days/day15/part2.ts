import { readInput } from "../../utils/input";
import { getKeysByPropertyValue } from "../../utils/map";

interface Coordinates {
  row: number;
  column: number;
}

let boxMap: Map<string, { boxNumber: number; symbol: string }> = new Map();
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
  MAP_WIDTH = input.split("\n")[0].length * 2;

  let boxNumber = 1;
  let wallNumber = 1;
  input.split("\n").forEach((line, row) => {
    line.split("").forEach((char, column) => {
      if (char === ".") {
        return;
      }
      if (char === "#") {
        wallMap.set(`${row}-${column * 2}`, wallNumber);
        wallMap.set(`${row}-${column * 2 + 1}`, wallNumber);
        wallNumber++;
        return;
      }
      if (char === "O") {
        boxMap.set(`${row}-${column * 2}`, { boxNumber, symbol: "[" });
        boxMap.set(`${row}-${column * 2 + 1}`, { boxNumber, symbol: "]" });
        boxNumber++;
        return;
      }
      if (char === "@") {
        robotPosition = { row, column: column * 2 };
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
 * Moves the robot horizontally
 * @param move - The move to make
 */
function moveRobotHorizontally(move: string) {
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
    const boxesToMove: { coordinates: Coordinates; boxNumber: number; symbol: string }[] = [
      {
        coordinates: { row: nextRow, column: nextColumn },
        boxNumber: boxMap.get(`${nextRow}-${nextColumn}`)!.boxNumber,
        symbol: boxMap.get(`${nextRow}-${nextColumn}`)!.symbol,
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
          boxNumber: boxMap.get(`${nextPosition.row}-${nextPosition.column}`)!.boxNumber,
          symbol: boxMap.get(`${nextPosition.row}-${nextPosition.column}`)!.symbol,
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
        const { boxNumber, coordinates, symbol } = box;
        boxMap.delete(`${coordinates.row}-${coordinates.column}`);
        const nextBoxPosition = getNextPosition(coordinates, move);
        boxMap.set(
          `${nextBoxPosition.row}-${nextBoxPosition.column}`,
          { boxNumber, symbol }
        );
      });
    }
    return;
  }

  // If the next position is empty, move the robot
  robotPosition = { row: nextRow, column: nextColumn };
}

/**
 * Moves the robot horizontally
 * @param move - The move to make
 */
function moveRobotVertically(move: string) {
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
    const boxesToMove: { coordinates: Coordinates; boxNumber: number; symbol: string }[] = [
      {
        coordinates: { row: nextRow, column: nextColumn },
        boxNumber: boxMap.get(`${nextRow}-${nextColumn}`)!.boxNumber,
        symbol: boxMap.get(`${nextRow}-${nextColumn}`)!.symbol,
      },
    ];

    // Get sibling box and add to list of boxes to move
    let boxSideA = boxMap.get(`${nextRow}-${nextColumn}`)!;
    let boxSideB;
    if (boxSideA.symbol === "[") {
      boxSideB = boxMap.get(`${nextRow}-${nextColumn + 1}`)!;
      boxesToMove.unshift({
        coordinates: { row: nextRow, column: nextColumn + 1 },
        boxNumber: boxSideB.boxNumber,
        symbol: boxSideB.symbol,
      });
    } else {
      boxSideB = boxMap.get(`${nextRow}-${nextColumn - 1}`)!;
      boxesToMove.unshift({
        coordinates: { row: nextRow, column: nextColumn - 1 },
        boxNumber: boxSideB.boxNumber,
        symbol: boxSideB.symbol,
      });
    }

    let hasSpace = false;
    let searching = true;

    // Get the next positions to search for boxes
    let nextPositions: Coordinates[] = [
      getNextPosition(boxesToMove[0].coordinates, move),
      getNextPosition(boxesToMove[1].coordinates, move),
    ];
    
    while (searching) {
      // If any of the next positions is a wall, we can't move
      if (nextPositions.some((nextPosition) => wallMap.has(`${nextPosition.row}-${nextPosition.column}`))) {
        searching = false;
        continue;
      }
      // If any of the next positions are a box, add them to the list of boxes to move
      if (nextPositions.some((nextPosition) => boxMap.has(`${nextPosition.row}-${nextPosition.column}`))) {
        // Track the number of boxes added to the list of boxes to move to facilitate updating the next positions
        let boxesToMoveAdded = 0;
        for (const nextPosition of nextPositions) {
          // If the next position is a box, add it to the list of boxes to move
          if (boxMap.has(`${nextPosition.row}-${nextPosition.column}`)) {
            boxSideA = boxMap.get(`${nextPosition.row}-${nextPosition.column}`)!;
            boxesToMove.unshift({
              coordinates: nextPosition,
              boxNumber: boxMap.get(`${nextPosition.row}-${nextPosition.column}`)!.boxNumber,
              symbol: boxMap.get(`${nextPosition.row}-${nextPosition.column}`)!.symbol,
            });

            // Get sibling box and add to list of boxes to move
            if (boxSideA.symbol === "[") {
              boxSideB = boxMap.get(`${nextPosition.row}-${nextPosition.column + 1}`)!;
              boxesToMove.unshift({
                coordinates: { row: nextPosition.row, column: nextPosition.column + 1 },
                boxNumber: boxSideB.boxNumber,
                symbol: boxSideB.symbol,
              });
            } else {
              boxSideB = boxMap.get(`${nextPosition.row}-${nextPosition.column - 1}`)!;
              boxesToMove.unshift({
                coordinates: { row: nextPosition.row, column: nextPosition.column - 1 },
                boxNumber: boxSideB.boxNumber,
                symbol: boxSideB.symbol,
              });
            }

            boxesToMoveAdded += 2;
          }
        }

        // Get the next positions to search for boxes based on the number of boxes added during the iteration
        let newNextPositions: Coordinates[] = [];
        for (let i = 0; i < boxesToMoveAdded; i++) {
          newNextPositions.push(getNextPosition(boxesToMove[i].coordinates, move));
        }

        // Update the next positions to search for boxes with new positions
        nextPositions = newNextPositions;

        continue;
      }
      
      // If all the next positions are empty, we can move
      hasSpace = true;
      searching = false;
    }

    // If there is space, move the robot and the boxes
    if (hasSpace) {
      // Move the robot and the boxes
      robotPosition = { row: nextRow, column: nextColumn };
      boxesToMove.forEach((box) => {
        const { boxNumber, coordinates, symbol } = box;
        boxMap.delete(`${coordinates.row}-${coordinates.column}`);
        const nextBoxPosition = getNextPosition(coordinates, move);
        boxMap.set(
          `${nextBoxPosition.row}-${nextBoxPosition.column}`,
          { boxNumber, symbol }
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
        map[row][column] = boxMap.get(`${row}-${column}`)!.symbol;
      } else if (wallMap.has(`${row}-${column}`)) {
        map[row][column] = "#";
      }
    }
  }
  for (const line of map) {
    console.log(line.join(""));
  }
}

/**
 * Gets the sum of all boxes' GPS coordinates
 * @returns The sum of all boxes' GPS coordinates
 */
function getSumOfBoxCoordinates(): number {
  let sum = 0;
  
  const numBoxes = boxMap.size / 2;

  for (let i = 1; i <= numBoxes; i++) {
    // Find sibling boxes
    const keys = getKeysByPropertyValue(boxMap, "boxNumber", i);
    const row = parseInt(keys[0].split("-")[0]);
    const columns = keys.map((key) => parseInt(key.split("-")[1]));
    const minColumn = Math.min(...columns);
    sum += row * 100 + minColumn;
  }

  return sum;
}

/**
 * Solves the second part of the day 15 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The sum of all boxes' GPS coordinates
 *
 * test-input.txt result: 9021
 * test-input2.txt result: 1751
 * test-input3.txt result: 618
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 15, isTest: useTestInput });

  parseInput(input);

  let move = moves.shift();
  while (move) {
    if (move === '<' || move === '>') {
      moveRobotHorizontally(move);
    } else {
      moveRobotVertically(move);
    }
    move = moves.shift();
  }

  const sumOfBoxCoordinates = getSumOfBoxCoordinates();

  return sumOfBoxCoordinates;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 2 Solution:", solve());
}

export default solve;
