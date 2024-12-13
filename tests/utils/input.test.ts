import * as fs from "fs";
import * as path from "path";
import { readInput } from "../../src/utils/input";

jest.mock("fs");

describe("readInput", () => {
  const mockReadFileSync = fs.readFileSync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should read the input file for a specific day", () => {
    const day = 1;
    const expectedContent = "Sample input content";
    const filePath = path.join(__dirname, `../../src/days/day01/input.txt`);

    mockReadFileSync.mockReturnValue(expectedContent);

    const result = readInput({ day, isTest: false });

    expect(mockReadFileSync).toHaveBeenCalledWith(filePath, "utf-8");
    expect(result).toBe(expectedContent);
  });

  it("should read the test input file for a specific day and part", () => {
    const day = 2;
    const part = 1;
    const expectedContent = "Test input content";
    const filePath = path.join(
      __dirname,
      `../../src/days/day02/part1-test-input.txt`
    );

    mockReadFileSync.mockReturnValue(expectedContent);

    const result = readInput({ day, isTest: true, part });

    expect(mockReadFileSync).toHaveBeenCalledWith(filePath, "utf-8");
    expect(result).toBe(expectedContent);
  });

  it("should read the test input file for a specific day without part", () => {
    const day = 3;
    const expectedContent = "Test input content without part";
    const filePath = path.join(
      __dirname,
      `../../src/days/day03/test-input.txt`
    );

    mockReadFileSync.mockReturnValue(expectedContent);

    const result = readInput({ day, isTest: true });

    expect(mockReadFileSync).toHaveBeenCalledWith(filePath, "utf-8");
    expect(result).toBe(expectedContent);
  });

  it("should throw an error if the file does not exist", () => {
    const day = 4;
    const filePath = path.join(
      __dirname,
      `../../src/days/day04/test-input.txt`
    );

    mockReadFileSync.mockImplementation(() => {
      throw new Error("File not found");
    });

    expect(() => readInput({ day, isTest: true })).toThrow("File not found");
    expect(mockReadFileSync).toHaveBeenCalledWith(filePath, "utf-8");
  });
});
