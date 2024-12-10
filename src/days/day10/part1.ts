import { readInput } from "../../utils/input";

const topographicMap = new Map<
  string,
  { row: number; column: number; height: number }
>();

/**
 * Initializes the topographic map from the input
 * @param input - The input to initialize the topographic map from
 */
function initializeTopographicMap(input: string): void {
  const lines = input.split("\n");

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row];
    for (let column = 0; column < line.length; column++) {
      const height = Number(line[column]);
      topographicMap.set(`${row}-${column}`, { row, column, height });
    }
  }
}

/**
 * Logs the topographic map to the console
 */
function logTopographicMap(): void {
  topographicMap.forEach((value, key) => {
    const { row, column, height } = value;
    console.log(`Key: ${key}`);
    console.log(`Row: ${row}, Column: ${column}, Height: ${height}`);
    console.log("--------------------------------");
  });
}

/**
 * Calculates the 9 height positions reachable from the current position
 * @param currentHeight - The height of the current position
 * @param nextRow - The row of the next position
 * @param nextColumn - The column of the next position
 * @param isTrailhead - Whether the current position is a trailhead
 * @returns The 9 height positions reachable from the current position
 */
function calculate9HeightPositionsReachable({
  currentHeight,
  nextRow,
  nextColumn,
  isTrailhead = false,
}: {
  currentHeight: number;
  nextRow: number;
  nextColumn: number;
  isTrailhead?: boolean;
}): string[] {
  const nextHeight =
    topographicMap.get(`${nextRow}-${nextColumn}`)?.height ?? 0;

  // If the current position is not a trailhead and the next position is not 1 height higher than the current position, return an empty array
  if (!isTrailhead && nextHeight - currentHeight !== 1) {
    return [];
  }

  // If the next position is the highest height, return the current position
  if (nextHeight === 9) {
    return [`${nextRow}-${nextColumn}`];
  }

  // Otherwise, return the 9 height positions reachable from the current position
  return Array.from(
    new Set(
      [
        // North
        calculate9HeightPositionsReachable({
          currentHeight: nextHeight,
          nextRow: nextRow - 1,
          nextColumn,
        }),
        // East
        calculate9HeightPositionsReachable({
          currentHeight: nextHeight,
          nextRow: nextRow,
          nextColumn: nextColumn + 1,
        }),
        // South
        calculate9HeightPositionsReachable({
          currentHeight: nextHeight,
          nextRow: nextRow + 1,
          nextColumn,
        }),
        // West
        calculate9HeightPositionsReachable({
          currentHeight: nextHeight,
          nextRow: nextRow,
          nextColumn: nextColumn - 1,
        }),
      ].flat()
    )
  );
}

/**
 * Scores the trailheads
 * @returns The sum of the scores of all trailheads
 */
function scoreTrailheads(): number {
  let totalTrailheadScore = 0;

  const positions = Array.from(topographicMap.entries());
  const trailheads = positions.filter(
    ([_, value]): boolean => value.height === 0
  );

  trailheads.forEach(([_, value]) => {
    const positionsReachable = calculate9HeightPositionsReachable({
      currentHeight: -1,
      nextRow: value.row,
      nextColumn: value.column,
      isTrailhead: true,
    });

    const trailheadScore = positionsReachable.length;
    totalTrailheadScore += trailheadScore;
  });

  return totalTrailheadScore;
}

/**
 * Solves the first part of the day 10 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The sum of the scores of all trailheads on your topographic map
 *
 * test-input.txt result: 36
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 10, isTest: useTestInput });

  initializeTopographicMap(input);

  const trailheadsScore = scoreTrailheads();

  return trailheadsScore;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
