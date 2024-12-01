import * as fs from "fs";
import * as path from "path";

async function runDay(
  day: number,
  part: number,
  useTestInput: boolean = false
) {
  try {
    // Pad day number with zero if needed
    const dayFolder = `day${day.toString().padStart(2, "0")}`;
    const dayPath = path.join(__dirname, "days", dayFolder);

    // Validate day and part
    if (!fs.existsSync(dayPath)) {
      throw new Error(`Day ${day} folder does not exist`);
    }

    // Dynamically import the correct part
    const modulePath = path.join(dayPath, `part${part}.ts`);
    if (!fs.existsSync(modulePath)) {
      throw new Error(`Part ${part} for Day ${day} does not exist`);
    }

    const solution = await import(modulePath);

    console.log(
      `Running Day ${day}, Part ${part} Solution (${
        useTestInput ? "Test" : "Actual"
      } Data)...`
    ); // Log when the solution is being run
    const startTime = Date.now(); // Start time for performance tracking

    // Assuming the default export is the solving function
    const result = solution.default(useTestInput);

    const endTime = Date.now(); // End time for performance tracking
    const duration = endTime - startTime; // Calculate duration

    console.log(
      `Day ${day}, Part ${part} Solution (${
        useTestInput ? "Test" : "Actual"
      } Data):`,
      result
    );
    console.log(`Execution time: ${duration} ms`); // Log the execution time

    return result;
  } catch (error) {
    console.error(`Error running Day ${day}, Part ${part}:`, error);
    throw error;
  }
}

// Allow running via command line
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2 || args.length > 3) {
    console.error("Usage: npm run day -- <day_number> <part_number> [test]");
    process.exit(1);
  }

  const day = parseInt(args[0], 10);
  const part = parseInt(args[1], 10);
  const useTestData = args[2] === "test";

  runDay(day, part, useTestData).catch(() => process.exit(1));
}

export default runDay;
