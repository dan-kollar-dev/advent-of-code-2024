import { readInput } from "../../utils/input";

interface Coordinates {
  x: number;
  y: number;
}

let START: Coordinates;
let END: Coordinates;

let WIDTH: number;
let HEIGHT: number;

let BASE_MIN_PICOSECONDS: number;

const WALL_MAP = new Map<string, number>();
const ROAD_MAP = new Map<string, { index: number; minPicoseconds: number }>();

let CURRENT_WALL_MAP = new Map<string, number>();
let CURRENT_ROAD_MAP = new Map<string, { index: number; minPicoseconds: number }>();

function parseInput(input: string): void {
  let wallIndex = 0;
  let roadIndex = 0;
  const lines = input.split("\n");
  HEIGHT = lines.length;
  WIDTH = lines[0].length;

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const char = lines[y][x];
      if (char === "#") {
        WALL_MAP.set(`${x},${y}`, wallIndex);
        wallIndex++;
        continue;
      }
      if (char === ".") {
        ROAD_MAP.set(`${x},${y}`, {
          index: roadIndex,
          minPicoseconds: Infinity,
        });
        roadIndex++;
        continue;
      }
      if (char === "S") {
        ROAD_MAP.set(`${x},${y}`, {
          index: roadIndex,
          minPicoseconds: Infinity,
        });
        roadIndex++;
        START = { x, y };
        continue;
      }
      if (char === "E") {
        ROAD_MAP.set(`${x},${y}`, {
          index: roadIndex,
          minPicoseconds: Infinity,
        });
        roadIndex++;
        END = { x, y };
        continue;
      }
    }
  }
}

function logMap(
  wallMap: Map<string, number>,
  roadMap: Map<string, { index: number; minPicoseconds: number }>
): void {
  for (let y = 0; y < HEIGHT; y++) {
    let row = "";
    for (let x = 0; x < WIDTH; x++) {
      if (wallMap.has(`${x},${y}`)) {
        row += "#";
        continue;
      }
      if (x === START.x && y === START.y) {
        row += "S";
        continue;
      }
      if (x === END.x && y === END.y) {
        row += "E";
        continue;
      }
      if (roadMap.has(`${x},${y}`)) {
        row += ".";
      }
    }
    console.log(row);
  }
}

function move({
  currentPosition,
  picoseconds,
}: {
  currentPosition: Coordinates;
  picoseconds: number;
}): void {
  console.log("Moving to", currentPosition, "with picoseconds", picoseconds);
  const { x, y } = currentPosition;

  // Out of bounds
  if (x > WIDTH || y > HEIGHT) {
    // console.log("Out of bounds");
    return;
  }

  // Hit a wall
  if (CURRENT_WALL_MAP.has(`${x},${y}`)) {
    // console.log("Hit a wall");
    return;
  }

  // Current position has already been visited with a lower picoseconds value
  if (CURRENT_ROAD_MAP.get(`${x},${y}`)?.minPicoseconds! <= picoseconds) {
    // console.log("Already visited with a lower picoseconds value");
    return;
  }

  // Update the road map
  CURRENT_ROAD_MAP.set(`${x},${y}`, {
    index: CURRENT_ROAD_MAP.size,
    minPicoseconds: picoseconds,
  });

  if (x === END.x && y === END.y) {
    // console.log("Reached the end");
    return;
  }

  // Move up
  move({
    currentPosition: { x, y: y - 1 },
    picoseconds: picoseconds + 1,
  });

  // Move right
  move({
    currentPosition: { x: x + 1, y },
    picoseconds: picoseconds + 1,
  });

  // Move down
  move({
    currentPosition: { x, y: y + 1 },
    picoseconds: picoseconds + 1,
  });

  // Move left
  move({
    currentPosition: { x: x - 1, y },
    picoseconds: picoseconds + 1,
  });
}

function isRemovable(wall: string): boolean {
  const [x, y] = wall.split(",").map(Number);

  // Not removable if on the edge
  if (x === 0 || y === 0 || x === WIDTH - 1 || y === HEIGHT - 1) {
    return false;
  }

  // // Not removable if it's a corner
  // if (WALL_MAP.has(`${x - 1},${y - 1}`) && WALL_MAP.has(`${x - 1},${y + 1}`)) {
  //   return false;
  // }

  // // Not removable if surrounded by walls
  // if (
  //   WALL_MAP.has(`${x - 1},${y}`) &&
  //   WALL_MAP.has(`${x + 1},${y}`) &&
  //   WALL_MAP.has(`${x},${y - 1}`) &&
  //   WALL_MAP.has(`${x},${y + 1}`)
  // ) {
  //   return false;
  // }

  // // Not removable if neither N/S adjacent or E/W adjacent are not walls
  // if (
  //   !(
  //     (!WALL_MAP.has(`${x},${y - 1}`) && !WALL_MAP.has(`${x},${y + 1}`)) ||
  //     (!WALL_MAP.has(`${x - 1},${y}`) && !WALL_MAP.has(`${x + 1},${y}`))
  //   )
  // ) {
  //   return false;
  // }

  return true;
}

/**
 * Solves the first part of the day 20 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The number of safe reports
 * 
 * test-input.txt result:
    There are 14 cheats that save 2 picoseconds.
    There are 14 cheats that save 4 picoseconds.
    There are 2 cheats that save 6 picoseconds.
    There are 4 cheats that save 8 picoseconds.
    There are 2 cheats that save 10 picoseconds.
    There are 3 cheats that save 12 picoseconds.
    There is one cheat that saves 20 picoseconds.
    There is one cheat that saves 36 picoseconds.
    There is one cheat that saves 38 picoseconds.
    There is one cheat that saves 40 picoseconds.
    There is one cheat that saves 64 picoseconds.
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 20, isTest: useTestInput });

  parseInput(input);

  // Establish the base minimum picoseconds
  CURRENT_WALL_MAP = new Map(WALL_MAP);
  CURRENT_ROAD_MAP = new Map(ROAD_MAP);

  move({
    currentPosition: START,
    picoseconds: 0,
  });

  BASE_MIN_PICOSECONDS = CURRENT_ROAD_MAP.get(`${END.x},${END.y}`)?.minPicoseconds!;

  // Initialize the cheat map
  const cheatMap = new Map<number, number>();

  // Check cheats by removing each wall
  for (const [key, _value] of WALL_MAP) {
    console.log("--------------------------------");
    console.log("Checking wall:", key);
    // Check if the wall is removable
    if (!isRemovable(key)) {
      console.log("Wall is not removable:", key);
      continue;
    }

    console.log("Wall is removable:", key);
    CURRENT_WALL_MAP = new Map(WALL_MAP);
    CURRENT_ROAD_MAP = new Map(ROAD_MAP);

    // Remove the wall
    CURRENT_WALL_MAP.delete(key);

    // Add the road
    CURRENT_ROAD_MAP.set(key, {
      index: CURRENT_ROAD_MAP.size,
      minPicoseconds: Infinity,
    });

    if (key === "6,7") {
      logMap(CURRENT_WALL_MAP, CURRENT_ROAD_MAP);
    }

    // Run the updated course
    move({
      currentPosition: START,
      picoseconds: 0,
    });

    // Get the minimum picoseconds to reach the end
    const minPicoseconds = CURRENT_ROAD_MAP.get(`${END.x},${END.y}`)
      ?.minPicoseconds!;
    console.log("Min picoseconds:", minPicoseconds);

    // Calculate the picoseconds saved
    const picosecondsSaved = BASE_MIN_PICOSECONDS - minPicoseconds;

    // Add the result to the cheat map if the picoseconds saved is greater than 0
    if (picosecondsSaved > 0) {
      cheatMap.set(picosecondsSaved, (cheatMap.get(picosecondsSaved) ?? 0) + 1);
    }
  }

  const sortedCheatMapEntries = Array.from(cheatMap.entries()).sort(
    ([keyA], [keyB]) => keyA - keyB
  );

  for (const [picosecondsSaved, count] of sortedCheatMapEntries) {
    console.log(
      `There are ${count} cheats that save ${picosecondsSaved} picoseconds.`
    );
  }

  let cheatCount = 0;

  // Iterate over the Map
  for (const [key, value] of cheatMap) {
    // Check if the key is greater than or equal to 10
    if (key >= 100) {
      cheatCount += value; // Accumulate the value
    }
  }

  // logMap(WALL_MAP, ROAD_MAP);
  return cheatCount;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
