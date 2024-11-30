/**
 * Returns all characters of string one without the characters of string two. Duplicates are removed but order is preserved.
 * @param one The string characters will be removed from
 * @param two The string that will be compared against
 * @returns A string of the unique characters to string one.
 * @example
 * stringDifference('abcd', 'bc')
 * // ==> 'ad'
 *
 * stringDifference('abcbbdaaccd', 'bc')
 * // ==> 'ad'
 */
const stringDifference = (one: string, two: string): string =>
  [...new Set(one)].filter((x) => ![...new Set(two)].includes(x)).join('');

export default stringDifference;
