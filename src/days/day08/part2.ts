import { readInput } from "../../utils/input";

const frequencyMap = new Map<
  string,
  { antennas: Coordinates[]; antinodes: Coordinates[] }
>();
let MAX_ROW = 0;
let MAX_COLUMN = 0;

interface Coordinates {
  row: number;
  column: number;
}

/**
 * Logs the frequency map to the console
 */
function logFrequencyMap(): void {
  frequencyMap.forEach((value, key) => {
    console.log(`Key: ${key}, Value:`, value);
  });
}

/**
 * Prints the frequency map to the console
 */
function printFrequencyMap(): void {
  const antinodes = Array.from(frequencyMap.values()).flatMap(
    (value) => value.antinodes
  );

  let grid = Array.from({ length: MAX_ROW + 1 }, () =>
    Array.from({ length: MAX_COLUMN + 1 }, () => ".")
  );

  for (let row = 0; row <= MAX_ROW; row++) {
    for (let column = 0; column <= MAX_COLUMN; column++) {
      if (
        antinodes.find((antinode) => antinode.row === row && antinode.column === column)
      ) {
        grid[row][column] = "#";
      }
    }
  }

  console.table(grid);
}

/**
 * Initializes the frequency map with the locations of the antennas
 * @param input - The input string
 */
function initializeLocations(input: string): void {
  input.split("\n").forEach((line, row) => {
    if (row > MAX_ROW) MAX_ROW = row;
    line.split("").forEach((char, column) => {
      if (column > MAX_COLUMN) MAX_COLUMN = column;
      if (char !== ".") {
        const coordinates: Coordinates = { row, column };
        const frequency = frequencyMap.get(char);

        if (!frequency) {
          frequencyMap.set(char, { antennas: [coordinates], antinodes: [] });
          return;
        }

        frequencyMap.set(char, {
          antennas: [...frequency.antennas, coordinates],
          antinodes: frequency.antinodes,
        });
      }
    });
  });
}

/**
 * Finds the antinodes in the frequency map
 */
function findAntinodes(): void {
  frequencyMap.forEach((coordinates, key) => {
    const { antennas } = coordinates;
    const antinodes: Coordinates[] = [];

    antennas.forEach((antenna) => {
      const { row: antennaRow, column: antennaColumn } = antenna;
      const siblings = antennas.filter((a) => a !== antenna);

      siblings.forEach((sibling) => {
        // Add the antenna itself as an antinode because if a sibling exists, then the antenna is an antinode
        antinodes.push({ row: antennaRow, column: antennaColumn });

        const rowDifference = antennaRow - sibling.row;
        const columnDifference = antennaColumn - sibling.column;

        let antinodeRow = antennaRow + rowDifference;
        let antinodeColumn = antennaColumn + columnDifference;

        while (
          antinodeRow >= 0 &&
          antinodeRow <= MAX_ROW &&
          antinodeColumn >= 0 &&
          antinodeColumn <= MAX_COLUMN
        ) {
          if (
            !antinodes.find(
              (antinode) =>
                antinode.row === antinodeRow &&
                antinode.column === antinodeColumn
            )
          ) {
            antinodes.push({ row: antinodeRow, column: antinodeColumn });
          }
          antinodeRow += rowDifference;
          antinodeColumn += columnDifference;
        }
      });
    });

    frequencyMap.set(key, { antennas, antinodes });
  });
}

/**
 * Gets the number of unique antinode locations
 * @returns The number of unique antinode locations
 */
function getUniqueAntinodeLocations(): number {
  const antinodes = Array.from(frequencyMap.values()).flatMap(
    (value) => value.antinodes
  );
  const uniqueAntinodes = new Set(
    antinodes.map((antinode) => `${antinode.row}-${antinode.column}`)
  );
  return uniqueAntinodes.size;
}

/**
 * Solves the second part of the day 8 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The number of unique locations within the bounds of the map containing an antinode
 *
 * test-input.txt result: 34
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 8, isTest: useTestInput });

  initializeLocations(input);

  findAntinodes();

  let uniqueAntinodeCount = getUniqueAntinodeLocations();

  return uniqueAntinodeCount;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 2 Solution:", solve());
}

export default solve;
