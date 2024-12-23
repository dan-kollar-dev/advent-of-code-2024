import { readInput } from "../../utils/input";

interface Coordinates {
  x: number;
  y: number;
}

interface Road {
  coordinates: Coordinates;
  index: number;
  minPicoseconds: number;
}

let START: Coordinates;
let END: Coordinates;

let WIDTH: number;
let HEIGHT: number;

const WALL_MAP = new Map<string, number>();
const ROAD_MAP = new Map<string, Road>();

/**
 * Parses the input and populates the WALL_MAP and ROAD_MAP
 * @param input - The input string
 */
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
          coordinates: { x, y },
          index: roadIndex,
          minPicoseconds: Infinity,
        });
        roadIndex++;
        continue;
      }
      if (char === "S") {
        ROAD_MAP.set(`${x},${y}`, {
          coordinates: { x, y },
          index: roadIndex,
          minPicoseconds: Infinity,
        });
        roadIndex++;
        START = { x, y };
        continue;
      }
      if (char === "E") {
        ROAD_MAP.set(`${x},${y}`, {
          coordinates: { x, y },
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

/**
 * Logs the map to the console
 * @param wallMap - The wall map
 * @param roadMap - The road map
 */
function logMap(
  wallMap: Map<string, number>,
  roadMap: Map<
    string,
    Road
  >
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

/**
 * Gets the next road to move to
 * @param currentRoad - The current road
 * @returns The next road
 */
function getNextRoad(currentRoad: Road): Road {
  const { x, y } = currentRoad.coordinates;

  const northRoad = ROAD_MAP.get(`${x},${y - 1}`);
  const southRoad = ROAD_MAP.get(`${x},${y + 1}`);
  const eastRoad = ROAD_MAP.get(`${x + 1},${y}`);
  const westRoad = ROAD_MAP.get(`${x - 1},${y}`);

  const roads = [northRoad, southRoad, eastRoad, westRoad].filter(
    (road) => road !== undefined && road.minPicoseconds === Infinity
  );

  if (roads.length === 0) {
    throw new Error("No roads found");
  }

  if (roads.length > 1) {
    throw new Error("Multiple roads found");
  }

  return roads[0]!;
}

/**
 * Races the race
 */
function race(): void {
  let currentRoad = ROAD_MAP.get(`${START.x},${START.y}`);
  let currentPicoseconds = 0;

  while (currentRoad) {
    if (currentRoad === undefined) {
      throw new Error("Current road not found");
    }

    currentRoad.minPicoseconds = currentPicoseconds;

    if (currentRoad.index === ROAD_MAP.get(`${END.x},${END.y}`)?.index) {
      break;
    }

    currentRoad = getNextRoad(currentRoad);
    currentPicoseconds += 1;
  }
}

/**
 * Solves the first part of the day 20 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The number of cheats that would save at least 100 picoseconds
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

  const minPicosecondsSaved = useTestInput ? 10 : 100;

  parseInput(input);

  race();

  // Initialize the cheat map
  const cheatMap = new Map<number, number>();

  // Check cheats by maximum time saved by removing each wall
  for (const [key, _value] of WALL_MAP) {
    const [x, y] = key.split(",").map(Number);
    
    // Check time saved east/west if we remove the wall
    const eastRoad = ROAD_MAP.get(`${x + 1},${y}`);
    const westRoad = ROAD_MAP.get(`${x - 1},${y}`);
    let eastWestTimeSaved = 0;
    if (eastRoad !== undefined && westRoad !== undefined) {
      eastWestTimeSaved = Math.abs(
        eastRoad.minPicoseconds - westRoad.minPicoseconds
      );
    }

    // Check time saved north/south if we remove the wall
    const northRoad = ROAD_MAP.get(`${x},${y - 1}`);
    const southRoad = ROAD_MAP.get(`${x},${y + 1}`);
    let northSouthTimeSaved = 0;
    if (northRoad !== undefined && southRoad !== undefined) {
      northSouthTimeSaved = Math.abs(
        northRoad.minPicoseconds - southRoad.minPicoseconds
      );
    }

    // Calculate the time saved by removing the wall and add to the cheat map
    const timeSaved = Math.max(eastWestTimeSaved, northSouthTimeSaved) - 2; // -2 to account for the cut
    if (timeSaved > 0) {
      cheatMap.set(timeSaved, (cheatMap.get(timeSaved) ?? 0) + 1);
    }
  }

  // Log the cheats
  // const sortedCheatMapEntries = Array.from(cheatMap.entries()).sort(
  //   ([keyA], [keyB]) => keyA - keyB
  // );
  // for (const [picosecondsSaved, count] of sortedCheatMapEntries) {
  //   console.log(
  //     `There are ${count} cheats that save ${picosecondsSaved} picoseconds.`
  //   );
  // }

  let cheatCount = 0;

  // Iterate over the cheat map
  for (const [key, value] of cheatMap) {
    // Check if the key is greater than or equal to minPicosecondsSaved
    if (key >= minPicosecondsSaved) {
      cheatCount += value;
    }
  }

  return cheatCount;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
