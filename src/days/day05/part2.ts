import { readInput } from "../../utils/input";

/**
 * Parses the page ordering rules
 * @param input - The input string containing the page ordering rules
 * @returns An object where the keys are the pages and the values are arrays of pages that must come before the key page
 */
function parsePageOrderingRules(input: string): {
  [key: string]: string[];
} {
  const rawRules = input.split("\n");
  const rules: { [key: string]: string[] } = {};
  for (const rule of rawRules) {
    const [key, value] = rule.split("|");
    if (rules[key]) {
      rules[key].push(value);
    } else {
      rules[key] = [value];
    }
  }
  return rules;
}

/**
 * Parses the page updates
 * @param input - The input string containing the page updates
 * @returns An array of arrays, where each inner array contains the pages in a single update
 */
function parsePageUpdates(input: string): string[][] {
  return input.split("\n").map((line) => line.split(","));
}

/**
 * Checks if a page update is correctly ordered
 * @param pageOrderingRules - An object where the keys are the pages and the values are arrays of pages that must come before the key page
 * @param pageUpdate - An array of pages in a single update
 * @returns Whether the page update is correctly ordered
 */
function isPageUpdateCorrectlyOrdered(
  pageOrderingRules: { [key: string]: string[] },
  pageUpdate: string[]
): boolean {
  const pageUpdateCopy = [...pageUpdate];
  let isValid = true;

  while (isValid && pageUpdateCopy.length > 1) {
    const currentPage = pageUpdateCopy.shift() ?? "";
    if (
      pageUpdateCopy.some(
        (page) =>
          pageOrderingRules[page] &&
          pageOrderingRules[page].includes(currentPage)
      )
    ) {
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Fixes a page update by moving pages to meet ordering rules
 * @param pageOrderingRules - An object where the keys are the pages and the values are arrays of pages that must come before the key page
 * @param pageUpdate - An array of pages in a single update
 * @returns The fixed page update
 */
function fixPageUpdate(
  pageOrderingRules: { [key: string]: string[] },
  pageUpdate: string[]
): string[] {
  const pageUpdateCopy = [...pageUpdate];
  const fixedPageUpdate: string[] = [];

  while (pageUpdateCopy.length > 0) {
    const currentPage = pageUpdateCopy.shift() ?? "";

    if (
      pageUpdateCopy.every(
        (page) =>
          !pageOrderingRules[page] ||
          (pageOrderingRules[page] &&
            !pageOrderingRules[page].includes(currentPage))
      )
    ) {
      fixedPageUpdate.push(currentPage);
      continue;
    }

    pageUpdateCopy.push(currentPage);
  }

  return fixedPageUpdate;
}

/**
 * Gets the middle page number from a page update
 * @param pageUpdate - An array of pages in a single update
 * @returns The middle page number
 */
function getMiddlePageNumber(pageUpdate: string[]): number {
  return parseInt(pageUpdate[Math.floor(pageUpdate.length / 2)]);
}

/**
 * Solves the second part of the day 5 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The sum of middle page numbers from incorrectly ordered updates after fixing them
 *
 * test-input.txt result: 123
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 5, isTest: useTestInput });
  const [pageOrderingRulesInput, pageUpdatesInput] = input.split("\n\n");

  const pageOrderingRules = parsePageOrderingRules(pageOrderingRulesInput);
  const pageUpdates = parsePageUpdates(pageUpdatesInput);

  const incorrectlyOrderedUpdates = pageUpdates.filter(
    (pageUpdate) => !isPageUpdateCorrectlyOrdered(pageOrderingRules, pageUpdate)
  );

  const fixedUpdates = incorrectlyOrderedUpdates.map((pageUpdate) =>
    fixPageUpdate(pageOrderingRules, pageUpdate)
  );

  const middlePageNumbers = fixedUpdates.map((pageUpdate) =>
    getMiddlePageNumber(pageUpdate)
  );

  const sum = middlePageNumbers.reduce((a, b) => a + b, 0);

  return sum;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 2 Solution:", solve());
}

export default solve;
