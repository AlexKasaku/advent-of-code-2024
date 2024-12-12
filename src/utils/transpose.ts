/**
 * Transposes (pivots) an array to flip rows + columns
 * @example
 * const value = [
 *  [1, 2, 3],
 *  [4, 5, 6],
 *  [7, 8, 9],
 * ];
 *
 * transpose(value)
 * // => [
 * //  [1, 4, 7],
 * //  [2, 5, 8],
 * //  [3, 6, 9],
 * // ]
 */
const transpose = <T>(array: T[][]) =>
  array[0].map((_, colIndex) => array.map((row) => row[colIndex]));

export default transpose;
