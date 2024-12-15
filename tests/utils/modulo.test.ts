import { moduloPositive } from "../../src/utils/modulo";

describe("moduloPositive", () => {
  it("should return positive modulo for positive numbers", () => {
    expect(moduloPositive(5, 3)).toBe(2);
    expect(moduloPositive(10, 4)).toBe(2);
  });

  it("should return positive modulo for negative numbers", () => {
    expect(moduloPositive(-1, 3)).toBe(2);
    expect(moduloPositive(-5, 3)).toBe(1);
  });

  it("should return zero when a is zero", () => {
    expect(moduloPositive(0, 3)).toBe(0);
  });

  it("should return zero when a is a multiple of b", () => {
    expect(moduloPositive(6, 3)).toBe(0);
    expect(moduloPositive(-6, 3)).toBe(0);
  });

  it("should handle edge case where b is 1", () => {
    expect(moduloPositive(5, 1)).toBe(0);
    expect(moduloPositive(-5, 1)).toBe(0);
  });
});
