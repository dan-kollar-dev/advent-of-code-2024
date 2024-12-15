/**
 * Returns the positive modulo of a number
 * @param a - The number to take the modulo of
 * @param b - The modulus
 * @returns The positive modulo of a
 */
export function moduloPositive(a: number, b: number): number {
  return ((a % b) + b) % b;
}
