import { rotateMatrix } from "../../src/utils/matrix";

describe("rotateMatrix", () => {
  it("should rotate a square matrix 90 degrees clockwise", () => {
    const input = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const expectedOutput = [
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ];
    expect(rotateMatrix(input)).toEqual(expectedOutput);
  });

  it("should rotate a rectangular matrix 90 degrees clockwise", () => {
    const input = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    const expectedOutput = [
      [5, 3, 1],
      [6, 4, 2],
    ];
    expect(rotateMatrix(input)).toEqual(expectedOutput);
  });

  it("should return an empty matrix when input is empty", () => {
    const input: number[][] = [];
    const expectedOutput: number[][] = [];
    expect(rotateMatrix(input)).toEqual(expectedOutput);
  });

  it("should handle a single element matrix", () => {
    const input = [[1]];
    const expectedOutput = [[1]];
    expect(rotateMatrix(input)).toEqual(expectedOutput);
  });
});
