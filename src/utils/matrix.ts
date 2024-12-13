export function rotateMatrix<T>(matrix: T[][]): T[][] {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  const rotatedMatrix: T[][] = Array.from({ length: cols }, () =>
    Array(rows).fill(undefined)
  );

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotatedMatrix[j][rows - 1 - i] = matrix[i][j];
    }
  }

  return rotatedMatrix;
}
