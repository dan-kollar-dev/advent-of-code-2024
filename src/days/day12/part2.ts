import { readInput } from "../../utils/input";
import { rotateMatrix } from "../../utils/matrix";

class Plot {
  row: number;
  column: number;
  plantType: string;

  constructor(row: number, column: number, plantType: string) {
    this.row = row;
    this.column = column;
    this.plantType = plantType;
  }
}

let NUM_ROWS = 0;
let NUM_COLUMNS = 0;

const gardenMap = new Map<string, string>();
const gardenPlotMap = new Map<string, Plot[][]>();

/**
 * Initializes the garden map from the input
 * @param input - The input to initialize the garden map from
 */
function initializeGardenMap(input: string): void {
  const lines = input.split("\n");

  NUM_ROWS = lines.length;
  NUM_COLUMNS = lines[0].length;

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row];
    for (let column = 0; column < line.length; column++) {
      const plantType = line[column];
      gardenMap.set(`${row}-${column}`, plantType);
      if (!gardenPlotMap.get(plantType)) {
        gardenPlotMap.set(plantType, []);
      }
      const regions = gardenPlotMap.get(plantType) ?? [];

      let plotPlaced = false;
      for (const region of regions) {
        // Check if the plot is adjacent to any plot in the other region
        if (
          region.some(
            (plot) =>
              (Math.abs(plot.row - row) === 1 &&
                Math.abs(plot.column - column) === 0) ||
              (Math.abs(plot.row - row) === 0 &&
                Math.abs(plot.column - column) === 1)
          )
        ) {
          // Add the plot to the region
          region.push(new Plot(row, column, plantType));
          // Set plotPlaced to true to indicate that the plot has been placed
          plotPlaced = true;
          // Break out of the loop as the plot has been placed
          break;
        }
      }

      // If the plot has not been placed, add it to a new region
      if (!plotPlaced) {
        regions.push([new Plot(row, column, plantType)]);
      }

      gardenPlotMap.set(plantType, regions);
    }
  }
}

/**
 * Consolidates the plots in the garden map
 */
function consolidatePlots(): void {
  let needsConsolidating = true;
  while (needsConsolidating) {
    needsConsolidating = false;
    gardenPlotMap.forEach((regions, plantType) => {
      for (let region of regions) {
        for (const plot of region) {
          const otherRegions = regions.filter((r) => r !== region);
          for (const otherRegion of otherRegions) {
            // Check if the plot is adjacent to any plot in the other region
            if (
              otherRegion.some(
                (otherPlot) =>
                  (Math.abs(otherPlot.row - plot.row) === 1 &&
                    Math.abs(otherPlot.column - plot.column) === 0) ||
                  (Math.abs(otherPlot.row - plot.row) === 0 &&
                    Math.abs(otherPlot.column - plot.column) === 1)
              )
            ) {
              // Get the unique plots in the other region that are not in the current region
              const uniqueOtherRegion = otherRegion.filter(
                (otherPlot) =>
                  !region.some(
                    (plot) =>
                      plot.row === otherPlot.row &&
                      plot.column === otherPlot.column
                  )
              );
              region.push(...uniqueOtherRegion);
              // Remove the other region from the regions
              regions.splice(regions.indexOf(otherRegion), 1);
              // Set needsConsolidating to true to indicate that the plots need to be consolidated again
              needsConsolidating = true;
            }
          }
        }
      }
    });
  }
}

/**
 * Builds a plot map from a region
 * @param region - The region to build the plot map for
 * @returns The plot map
 */
function buildPlotMap(region: Plot[]): string[][] {
  const plotMap = new Array(NUM_ROWS)
    .fill(0)
    .map(() => new Array(NUM_COLUMNS).fill(0));
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLUMNS; j++) {
      plotMap[i][j] = region.some((plot) => plot.row === i && plot.column === j)
        ? "#"
        : ".";
    }
  }
  return plotMap;
}

/**
 * Gets the number of top sides in a plot map
 * @param plotMap - The plot map to get the number of top sides from
 * @returns The number of top sides
 */
function getTopSideCount(plotMap: string[][]): number {
  let totalCount = 0;
  for (let i = 0; i < NUM_ROWS; i++) {
    let layer = "";
    for (let j = 0; j < NUM_COLUMNS; j++) {
      if (plotMap[i - 1]?.[j] !== "#") {
        layer += plotMap[i][j];
      } else {
        layer += ".";
      }
    }
    const layerCount = (layer.match(/#+/g) ?? []).length;
    totalCount += layerCount;
  }
  return totalCount;
}

/**
 * Gets the number of sides for a region
 * @param region - The region to get the number of sides for
 * @returns The number of sides
 */
function getNumberOfSides(region: Plot[]): number {
  let numberOfSides = 0;

  let plotMap = buildPlotMap(region);

  // Get the number of top sides
  const topSideCount = getTopSideCount(plotMap);
  numberOfSides += topSideCount;

  // Rotate the plot map to get the right side
  plotMap = rotateMatrix(plotMap);

  // Get the number of right sides
  const rightSideCount = getTopSideCount(plotMap);
  numberOfSides += rightSideCount;

  // Rotate the plot map to get the bottom side
  plotMap = rotateMatrix(plotMap);

  // Get the number of bottom sides
  const bottomSideCount = getTopSideCount(plotMap);
  numberOfSides += bottomSideCount;

  // Rotate the plot map to get the left side
  plotMap = rotateMatrix(plotMap);

  // Get the number of left sides
  const leftSideCount = getTopSideCount(plotMap);
  numberOfSides += leftSideCount;

  return numberOfSides;
}

/**
 * Calculates the fencing price for all regions
 * @returns The total fencing price for all regions
 */
function calculateFencingPrice(): number {
  let totalPrice = 0;
  gardenPlotMap.forEach((regions, plantType) => {
    for (const region of regions) {
      const area = region.length;
      let perimeter = getNumberOfSides(region);
      const price = area * perimeter;
      totalPrice += price;
    }
  });
  return totalPrice;
}

function logGardenPlotMap(): void {
  gardenPlotMap.forEach((regions, plantType) => {
    console.log(`Plant Type: ${plantType}`);
    for (const region of regions) {
      console.log(region);
    }
    console.log("--------------------------------");
  });
}

/**
 * Solves the second part of the day 12 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The total price of fencing of all regions
 *
 * test-input.txt result: 80
 * test-input2.txt result: 436
 * test-input3.txt results: 1206
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const input = readInput({ day: 12, isTest: useTestInput });

  initializeGardenMap(input);

  consolidatePlots();

  const price = calculateFencingPrice();

  return price;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 2 Solution:", solve());
}

export default solve;
