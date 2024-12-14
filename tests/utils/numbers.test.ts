import { getFactors, roundToDecimals } from "../../src/utils/number";

describe("getFactors", () => {
  it("should return factors of a positive integer", () => {
    expect(getFactors(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(getFactors(15)).toEqual([1, 3, 5, 15]);
    expect(getFactors(28)).toEqual([1, 2, 4, 7, 14, 28]);
  });

  it("should return an empty array for 0", () => {
    expect(getFactors(0)).toEqual([]);
  });

  it("should return an empty array for negative integers", () => {
    expect(getFactors(-5)).toEqual([]);
    expect(getFactors(-10)).toEqual([]);
  });

  it("should return [1] for 1", () => {
    expect(getFactors(1)).toEqual([1]);
  });

  it("should return [1] for prime numbers", () => {
    expect(getFactors(7)).toEqual([1, 7]);
    expect(getFactors(13)).toEqual([1, 13]);
  });
});

describe("roundToDecimals", () => {
  test("rounds positive numbers correctly", () => {
    expect(roundToDecimals(1.23456, 2)).toBe(1.23);
    expect(roundToDecimals(1.23556, 2)).toBe(1.24);
    expect(roundToDecimals(1.235, 3)).toBe(1.235);
  });

  test("rounds negative numbers correctly", () => {
    expect(roundToDecimals(-1.23456, 2)).toBe(-1.23);
    expect(roundToDecimals(-1.23556, 2)).toBe(-1.24);
    expect(roundToDecimals(-1.235, 3)).toBe(-1.235);
  });

  test("rounds to zero decimal places", () => {
    expect(roundToDecimals(1.5, 0)).toBe(2);
    expect(roundToDecimals(1.4, 0)).toBe(1);
    expect(roundToDecimals(-1.5, 0)).toBe(-1);
    expect(roundToDecimals(-1.4, 0)).toBe(-1);
  });

  test("rounds to a large number of decimal places", () => {
    expect(roundToDecimals(1.123456789, 8)).toBe(1.12345679);
    expect(roundToDecimals(1.123456789, 10)).toBe(1.123456789);
  });

  test("handles edge cases", () => {
    expect(roundToDecimals(0, 2)).toBe(0);
    expect(roundToDecimals(0.00001, 5)).toBe(0.00001);
    expect(roundToDecimals(0.000015, 5)).toBe(0.00002);
  });
});
