import { readInput } from "../../utils/input";

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

const gardenMap = new Map<string, string>();
const gardenPlotMap = new Map<string, Plot[][]>();

/**
 * Get the adjacent plants to a given plot
 * @param coordinates - The plot to get the adjacent plants from
 * @returns The adjacent plants to the given plot
 */
function getAdjacentPlants(coordinates: Plot): string[] {
  const north =
    gardenMap.get(`${coordinates.row - 1}-${coordinates.column}`) ?? "#";
  const south =
    gardenMap.get(`${coordinates.row + 1}-${coordinates.column}`) ?? "#";
  const east =
    gardenMap.get(`${coordinates.row}-${coordinates.column + 1}`) ?? "#";
  const west =
    gardenMap.get(`${coordinates.row}-${coordinates.column - 1}`) ?? "#";
  return [north, south, east, west];
}

/**
 * Initializes the garden map from the input
 * @param input - The input to initialize the garden map from
 */
function initializeGardenMap(input: string): void {
  const lines = input.split("\n");

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
              // Add the unique plots to the current region
              region.push(...uniqueOtherRegion);
              // Remove the other region from the regions
              regions.splice(regions.indexOf(otherRegion), 1);
              // Set needsConsolidating to true to indicate that the plots need to be checked for consolidation again
              needsConsolidating = true;
            }
          }
        }
      }
    });
  }
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
      let perimeter = 0;
      for (const plot of region) {
        const adjacentPlants = getAdjacentPlants(plot);
        const differentPlants = adjacentPlants.filter(
          (plant) => plant !== plantType
        );
        perimeter += differentPlants.length;
      }
      const price = area * perimeter;
      totalPrice += price;
    }
  });
  return totalPrice;
}

/**
 * Logs the garden plot map
 */
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
 * Solves the first part of the day 12 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns The total price of fencing of all regions
 *
 * test-input.txt result: 140
 * test-input2.txt result: 772
 * test-input3.txt results: 1930
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
  console.log("Part 1 Solution:", solve());
}

export default solve;
