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
 * Logs the robot map to the console
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

function logRobotCounts() {
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
}

/**
 * Scores the quadrants of the map
 * @param xLimit - The x limit of the map
 * @param yLimit - The y limit of the map
 * @returns The score of the quadrants
 */
function scoreQuadrants({
  xLimit,
  yLimit,
}: {
  xLimit: number;
  yLimit: number;
}): number {
  generateRobotCounts({ xLimit, yLimit });

  const quadrants = [
    {
      xStart: 0,
      xEnd: Math.floor(xLimit / 2),
      yStart: 0,
      yEnd: Math.floor(yLimit / 2),
    },
    {
      xStart: Math.ceil(xLimit / 2),
      xEnd: xLimit,
      yStart: 0,
      yEnd: Math.floor(yLimit / 2),
    },
    {
      xStart: 0,
      xEnd: Math.floor(xLimit / 2),
      yStart: Math.ceil(yLimit / 2),
      yEnd: yLimit,
    },
    {
      xStart: Math.ceil(xLimit / 2),
      xEnd: xLimit,
      yStart: Math.ceil(yLimit / 2),
      yEnd: yLimit,
    },
  ];

  let quadrantScores: number[] = [];
  for (const quadrant of quadrants) {
    let quadrantScore = 0;
    const { xStart, xEnd, yStart, yEnd } = quadrant;
    for (let x = xStart; x < xEnd; x++) {
      for (let y = yStart; y < yEnd; y++) {
        quadrantScore += robotCounts[y][x];
      }
    }
    quadrantScores.push(quadrantScore);
  }

  const totalScore = quadrantScores.reduce((a, b) => a * b, 1);

  return totalScore;
}

/**
 * Solves the first part of the day 14 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The safety factor after exactly 100 seconds have elapsed
 *
 * test-input.txt result: 12
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const xLimit = useTestInput ? TEST_INPUT_X_LIMIT : INPUT_X_LIMIT;
  const yLimit = useTestInput ? TEST_INPUT_Y_LIMIT : INPUT_Y_LIMIT;
  const input = readInput({ day: 14, isTest: useTestInput });

  generateRobotMap(input);

  for (let i = 0; i < 100; i++) {
    moveRobots({ xLimit, yLimit });
  }

  const score = scoreQuadrants({ xLimit, yLimit });
  return score;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
