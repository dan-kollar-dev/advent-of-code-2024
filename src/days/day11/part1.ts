import { readInput } from "../../utils/input";

/**
 * Blinks the map of stones
 * @param map - The map of stones
 * @returns The new map of stones
 */
function blink(map: Map<string, number>): Map<string, number> {
  let newMap = new Map<string, number>();

  map.forEach((value, key) => {
    if (key === "0") {
      newMap.set("1", (newMap.get("1") || 0) + value);
      return;
    }

    if (key.length % 2 === 0) {
      const leftHalf = Number(key.slice(0, key.length / 2)).toString();
      const rightHalf = Number(key.slice(key.length / 2)).toString();
      newMap.set(leftHalf, (newMap.get(leftHalf) || 0) + value);
      newMap.set(rightHalf, (newMap.get(rightHalf) || 0) + value);
      return;
    }

    newMap.set((Number(key) * 2024).toString(), (newMap.get((Number(key) * 2024).toString()) || 0) + value);
  });
  
  return newMap;
}

/**
 * Solves the first part of the day 11 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The number of stones after blinking 25 times
 *
 * test-input.txt result: 55312
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 11, isTest: useTestInput });

  let map = new Map<string, number>();
  input.split(" ").forEach((value) => {
    map.set(value, (map.get(value) || 0) + 1);
  });

  for (let i = 0; i < 25; i++) {
    const newMap = blink(map);
    map = newMap;
  }

  let stoneCount = 0;
  map.forEach((value, key) => {
    stoneCount += value;
  });

  return stoneCount;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
