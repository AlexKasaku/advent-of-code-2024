/**
 * Returns all characters of string one that also appear in string two. Duplicates are removed but order is preserved.
 * @param one The string characters will be returned from
 * @param two The string that will be compared against
 * @returns A string of the characters common to both strings.
 * @example
 * stringDifference('abcd', 'bce')
 * // ==> 'bc'
 *
 * stringDifference('abcbbdaaccd', 'bce')
 * // ==> 'bc'
 */
const stringIntersect = (one: string, two: string): string =>
  [...new Set(one)].filter((x) => [...new Set(two)].includes(x)).join('');

export default stringIntersect;
