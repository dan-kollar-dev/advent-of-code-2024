import { readInput } from "../../utils/input";
import { moduloPositive } from "../../utils/modulo";

const TEST_INPUT_X_LIMIT = 11;
const TEST_INPUT_Y_LIMIT = 7;
const INPUT_X_LIMIT = 101;
const INPUT_Y_LIMIT = 103;

type Point = {
  x: number;
  y: number;
};

type Velocity = {
  x: number;
  y: number;
};

const robotMap: Map<string, { point: Point; velocity: Velocity }> = new Map();

let robotCounts: number[][] = [];

/**
 * Generates the robot counts
 * @param xLimit - The x limit of the map
 * @param yLimit - The y limit of the map
 */
function generateRobotCounts({
  xLimit,
  yLimit,
}: {
  xLimit: number;
  yLimit: number;
}): void {
  robotCounts = Array.from({ length: yLimit }, () => Array(xLimit).fill(0));
  for (const robot of robotMap.values()) {
    robotCounts[robot.point.y][robot.point.x] += 1;
  }
}

/**
 * Logs the robot map to the console
 */
function logRobotMap() {
  console.table(robotCounts.map((row) => row.join("")).join("\n"));
}

/**
 * Generates the robot map from the input
 * @param input - The input to generate the robot map from
 */
function generateRobotMap(input: string): void {
  const lines = input.split("\n");
  for (const [index, line] of lines.entries()) {
    const [p, v] = line.split("v=").map((s) => s.trim());
    const [px, py] = p
      .split("=")[1]
      .split(",")
      .map((s) => parseInt(s.trim()));
    const [vx, vy] = v.split(",").map((s) => parseInt(s.trim()));
    robotMap.set(`${index}`, {
      point: { x: px, y: py },
      velocity: { x: vx, y: vy },
    });
  }
}

/**
 * Moves the robots by their velocity
 * @param xLimit - The x limit of the map
 * @param yLimit - The y limit of the map
 */
function moveRobots({
  xLimit,
  yLimit,
}: {
  xLimit: number;
  yLimit: number;
}): void {
  for (const robot of robotMap.values()) {
    robot.point.x = moduloPositive(robot.point.x + robot.velocity.x, xLimit);
    robot.point.y = moduloPositive(robot.point.y + robot.velocity.y, yLimit);
  }
  generateRobotCounts({ xLimit, yLimit });
}

/**
 * Checks if the robot map has a christmas tree piece of the form:
 *                  1
 *                 111
 *                11111
 *               1111111
 *              111111111
 * @returns Whether the robot map has a christmas tree piece
 */
function hasChristmasTree(): boolean {
  for (let y = 0; y < robotCounts.length; y++) {
    for (let x = 0; x < robotCounts[y].length; x++) {
      if (robotCounts[y][x] !== 0) {
        if (
          robotCounts[y + 1] &&
          robotCounts[y + 1].slice(x - 1, x + 2).length === 3 &&
          robotCounts[y + 1].slice(x - 1, x + 2).every((v) => v !== 0)
        ) {
          if (
            robotCounts[y + 2] &&
            robotCounts[y + 2].slice(x - 2, x + 3).length === 5 &&
            robotCounts[y + 2].slice(x - 2, x + 3).every((v) => v !== 0)
          ) {
            if (
              robotCounts[y + 3] &&
              robotCounts[y + 3].slice(x - 3, x + 4).length === 7 &&
              robotCounts[y + 3].slice(x - 3, x + 4).every((v) => v !== 0)
            ) {
              if (
                robotCounts[y + 4] &&
                robotCounts[y + 4].slice(x - 4, x + 5).length === 9 &&
                robotCounts[y + 4].slice(x - 4, x + 5).every((v) => v !== 0)
              ) {
                if (
                  robotCounts[y + 5] &&
                  robotCounts[y + 5].slice(x - 5, x + 6).length === 11 &&
                  robotCounts[y + 5].slice(x - 5, x + 6).every((v) => v !== 0)
                ) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
  }
  return false;
}

/**
 * Solves the second part of the day 14 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The fewest number of seconds that must elapse for the robots to display the Easter egg
 *
 * test-input.txt result: N/A
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const xLimit = useTestInput ? TEST_INPUT_X_LIMIT : INPUT_X_LIMIT;
  const yLimit = useTestInput ? TEST_INPUT_Y_LIMIT : INPUT_Y_LIMIT;
  const input = readInput({ day: 14, isTest: useTestInput });

  generateRobotMap(input);

  let numSeconds = 0;
  let christmasTreeFound = false;
  while (!christmasTreeFound && numSeconds < 10000) {
    numSeconds++;
    moveRobots({ xLimit, yLimit });
    if (hasChristmasTree()) {
      christmasTreeFound = true;
    }
  }

  logRobotMap();

  return numSeconds;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
