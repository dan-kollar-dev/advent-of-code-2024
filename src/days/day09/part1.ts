import { readInput } from "../../utils/input";

interface File {
  fileId: number;
  fileBlocks: number;
  freeBlocks: number;
}

const fileMap = new Map<number, { fileBlocks: number; freeBlocks: number }>();
let MAX_FILE_ID = 0;

/**
 * Logs the file map to the console
 */
function logFileMap(): void {
  fileMap.forEach((value, key) => {
    console.log("File ID:", key);
    console.log("File Blocks:", value.fileBlocks);
    console.log("Free Blocks:", value.freeBlocks);
    console.log("--------------------------------");
  });
  console.log("MAX_FILE_ID:", MAX_FILE_ID);
}

/**
 * Builds the file map from the disk map
 * @param diskMap - The disk map
 */
function buildFileMap(diskMap: string): void {
  for (let i = 0; i < diskMap.length; i += 2) {
    const fileId = i / 2;
    const fileBlocks = Number(diskMap[i]);
    const freeBlocks = Number(diskMap[i + 1] ?? 0);

    fileMap.set(fileId, { fileBlocks, freeBlocks });

    if (fileId > MAX_FILE_ID) {
      MAX_FILE_ID = fileId;
    }
  }
}

/**
 * Gets the checksum of the file map
 * @returns the checksum
 */
function getChecksum(): number {
  let compactedSum = 0;
  let index = 0;
  let currentFileId = 0;
  let lastFileId = MAX_FILE_ID;

  while (currentFileId < lastFileId) {
    const fileBlocks = fileMap.get(currentFileId)?.fileBlocks ?? 0;
    for (let i = 0; i < fileBlocks; i++) {
      compactedSum += index * currentFileId;
      index++;
    }

    // If the current file has no free blocks, we can move on to the next file
    if (fileMap.get(currentFileId)?.freeBlocks === 0) {
      currentFileId++;
      continue;
    }

    // While the current file has free blocks, we need to find a file to compact with
    while (fileMap.get(currentFileId)?.freeBlocks ?? 0 > 0) {
      if (fileMap.get(lastFileId)?.fileBlocks === 0) {
        lastFileId--;
        continue;
      }

      // Updated the compacted sum
      compactedSum += index * lastFileId;
      index++;

      // Decrement the file blocks of the last file
      fileMap.set(lastFileId, {
        fileBlocks: (fileMap.get(lastFileId)?.fileBlocks ?? 0) - 1,
        freeBlocks: fileMap.get(lastFileId)?.freeBlocks ?? 0,
      });

      // Decrement the free blocks of the current file
      fileMap.set(currentFileId, {
        fileBlocks: fileMap.get(currentFileId)?.fileBlocks ?? 0,
        freeBlocks: (fileMap.get(currentFileId)?.freeBlocks ?? 0) - 1,
      });
    }

    currentFileId++;
  }

  // If the last file has file blocks, we need to add them to the compacted sum
  if (fileMap.get(currentFileId)?.fileBlocks ?? 0 > 0) {
    const fileBlocks = fileMap.get(currentFileId)?.fileBlocks ?? 0;
    for (let i = 0; i < fileBlocks; i++) {
      compactedSum += index * currentFileId;
      index++;
    }
  }

  return compactedSum;
}

/**
 * Solves the first part of the day 9 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns the resulting filesystem checksum
 *
 * test-input.txt result: 1928
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const diskMap = readInput({ day: 9, isTest: useTestInput });

  buildFileMap(diskMap);

  const checksum = getChecksum();

  return checksum;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 1 Solution:", solve());
}

export default solve;
