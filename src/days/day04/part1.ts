import { readInput } from "../../utils/input";

const WORD_SEARCH_WORD = "XMAS";
let grid: string[][];

/**
 * Initializes the grid from the input
 * @param input - The input string
 */
function initializeGrid(input: string): void {
  grid = input.split("\n").map((row) => row.split(""));
}

/**
 * Fetches all the words that can be formed starting from the given row and column
 * @param rowNumber - The row number
 * @param columnNumber - The column number
 * @returns All the words that can be formed
 */
function fetchWords(rowNumber: number, columnNumber: number): string[] {
  const words: string[] = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      words.push(fetchWord({ rowNumber, columnNumber, rowChange: i, columnChange: j, wordLength: WORD_SEARCH_WORD.length }));
    }
  }
  return words;
}

/**
 * Fetches a word from the grid starting from the given row and column
 * @param rowNumber - The row number
 * @param columnNumber - The column number
 * @param rowChange - The row change
 * @param columnChange - The column change
 * @param wordLength - The word length
 * @returns The word
 */
function fetchWord({ rowNumber, columnNumber, rowChange, columnChange, wordLength }: { rowNumber: number, columnNumber: number, rowChange: number, columnChange: number, wordLength: number }): string {
  let word = "";
  if (rowChange === 0 && columnChange === 0) {
    return word;
  }
  let currentRow = rowNumber;
  let currentColumn = columnNumber;
  for (let i = 0; i < wordLength; i++) {
    if (currentRow >= 0 && currentRow < grid.length && currentColumn >= 0 && currentColumn < grid[currentRow].length) {
      word += grid[currentRow][currentColumn];
    } else {
      break;
    }
    currentRow += rowChange;
    currentColumn += columnChange;
  }
  return word;
}

/**
 * Solves the first part of the day 4 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The number of times XMAS appears in the grid
 *
 * test-input.txt result: 18
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 4, isTest: useTestInput });
  initializeGrid(input);

  let totalXmasCount = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      if (grid[row][column] === 'X') {
        // Fetch all the words that can be formed starting from the current row and column
        const words = fetchWords(row, column);
        // Count the number of times XMAS appears in the words
        const xmasCount = words.filter((word: string) => word === WORD_SEARCH_WORD).length;
        // Add the number of times XMAS appears to the total count
        totalXmasCount += xmasCount;
      }
    }
  }

  return totalXmasCount;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
