import { readInput } from "../../utils/input";

function solve(useTestInput: boolean = false): string {
  const input = readInput({ day: 0, isTest: useTestInput });
  const lines = input.split("\n");

  const letters = lines.join("-");

  return letters;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 2 Solution:", solve());
}

export default solve;
