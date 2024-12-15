/**
 * Returns the factors of a number
 * @param n - The number to get the factors of
 * @returns The factors of n
 */
export function getFactors(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1).filter((i) => n % i === 0);
}

/**
 * Rounds a number to a certain number of decimal places
 * @param num - The number to round
 * @param decimals - The number of decimal places to round to
 * @returns The rounded number
 */
export function roundToDecimals(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}
