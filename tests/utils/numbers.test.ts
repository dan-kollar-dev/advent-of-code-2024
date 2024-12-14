import { getFactors } from "../../src/utils/number";

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
