import { readInput } from "../../utils/input";

const fileMap = new Map<
  number,
  {
    fillerFilesBefore: { fileId: number; blocks: number }[];
    freeBlocksBefore: number;
    fileBlocks: number;
    fillerFilesAfter: { fileId: number; blocks: number }[];
    freeBlocksAfter: number;
  }
>();
let MAX_FILE_ID = 0;

function logFileMap(): void {
  fileMap.forEach((value, key) => {
    console.log("File ID:", key);
    console.log("Filler Files Before IDs:", value.fillerFilesBefore);
    console.log("Free Blocks Before:", value.freeBlocksBefore);
    console.log("File Blocks:", value.fileBlocks);
    console.log("Filler Files After IDs:", value.fillerFilesAfter);
    console.log("Free Blocks After:", value.freeBlocksAfter);
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

    fileMap.set(fileId, {
      fillerFilesBefore: [],
      freeBlocksBefore: 0,
      fileBlocks,
      fillerFilesAfter: [],
      freeBlocksAfter: freeBlocks,
    });

    if (fileId > MAX_FILE_ID) {
      MAX_FILE_ID = fileId;
    }
  }
}

/**
 * Moves the files to their correct positions
 */
function moveFiles(): void {
  for (let rightFileId = MAX_FILE_ID; rightFileId >= 0; rightFileId--) {
    const rightFile = fileMap.get(rightFileId);
    if (rightFile?.fileBlocks === 0) {
      continue;
    }

    for (let leftFileId = 0; leftFileId < rightFileId; leftFileId++) {
      const leftFile = fileMap.get(leftFileId);
      if (
        leftFile &&
        rightFile &&
        leftFile.freeBlocksBefore >= rightFile.fileBlocks
      ) {
        leftFile.fillerFilesBefore.push({
          fileId: rightFileId,
          blocks: rightFile.fileBlocks,
        });
        leftFile.freeBlocksBefore -= rightFile.fileBlocks;
        rightFile.freeBlocksBefore += rightFile.fileBlocks;
        rightFile.fileBlocks = 0;
        break;
      }

      if (
        leftFile &&
        rightFile &&
        leftFile.freeBlocksAfter >= rightFile.fileBlocks
      ) {
        leftFile.fillerFilesAfter.push({
          fileId: rightFileId,
          blocks: rightFile.fileBlocks,
        });
        leftFile.freeBlocksAfter -= rightFile.fileBlocks;
        rightFile.freeBlocksBefore += rightFile.fileBlocks;
        rightFile.fileBlocks = 0;
        break;
      }
    }
  }
}

/**
 * Gets the checksum of the file map
 * @returns the checksum
 */
function getChecksum(): number {
  let index = 0;
  let checksum = 0;
  let currentFileId = 0;

  while (currentFileId <= MAX_FILE_ID) {
    const file = fileMap.get(currentFileId);

    if (!file) {
      throw new Error(`File not found for index: ${index}`);
    }

    // Add the fillerFilesBefore fileId blocks times
    if (file.fillerFilesBefore.length > 0) {
      file.fillerFilesBefore.forEach(({ fileId, blocks }) => {
        for (let i = 0; i < Number(blocks); i++) {
          checksum += Number(fileId) * index;
          index++;
        }
      });
    }

    // Increment index by the freeBlocksBefore
    index += Number(file.freeBlocksBefore);

    // Add the blockFiles currentFileId blocks times
    for (let i = 0, len = Number(file.fileBlocks); i < len; i++) {
      checksum += Number(currentFileId) * index;
      index++;
    }

    // Add the fillerFilesAfter fileId blocks times
    if (file.fillerFilesAfter.length > 0) {
      file.fillerFilesAfter.forEach(({ fileId, blocks }) => {
        for (let i = 0; i < Number(blocks); i++) {
          checksum += Number(fileId) * index;
          index++;
        }
      });
    }

    // Increment index by the freeBlocksAfter
    index += Number(file.freeBlocksAfter);

    currentFileId++;
  }

  return checksum;
}

/**
 * Prints the file map to the console
 */
function printFileMap(): void {
  let compactedDiskMap = "";

  for (let i = 0; i <= MAX_FILE_ID; i++) {
    const file = fileMap.get(i);
    // Add the fillerFilesBefore fileId blocks times
    compactedDiskMap += file?.fillerFilesBefore
      .map((f) => Array(f.blocks).fill(f.fileId).join(""))
      .join("");
    // Add the freeBlocksBefore freeBlocksBefore times
    compactedDiskMap += Array(file?.freeBlocksBefore).fill(".").join("");
    // Add the fileId fileBlocks times
    compactedDiskMap += Array(file?.fileBlocks).fill(i).join("");
    // Add the fillerFilesAfter fileId blocks times
    compactedDiskMap += file?.fillerFilesAfter
      .map((f) => Array(f.blocks).fill(f.fileId).join(""))
      .join("");
    // Add the freeBlocksAfter freeBlocksAfter times
    compactedDiskMap += Array(file?.freeBlocksAfter).fill(".").join("");
  }

  console.log("Compacted Disk Map:", compactedDiskMap);
}

/**
 * Solves the second part of the day 9 challenge
 * @param useTestInput - Whether to use the test input or the actual input
 * @returns the resulting filesystem checksum
 *
 * test-input.txt result: 2858
 * input.txt result: ???
 */
function solve(useTestInput: boolean = false): number {
  const diskMap = readInput({ day: 9, isTest: useTestInput });

  buildFileMap(diskMap);

  moveFiles();

  const checksum = getChecksum();

  return checksum;
}

// If this file is run directly
if (require.main === module) {
  console.log("Part 2 Solution:", solve());
}

export default solve;
