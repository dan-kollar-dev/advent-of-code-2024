export function getFactors(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1).filter((i) => n % i === 0);
}

export function roundToDecimals(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}
