/**
 * Determines if two sets are equal, i.e. their sizes match and every element in set A is in set B
 * @param a Set a to compare
 * @param b Set b to compare
 * @returns true if sets match, false otherwise
 */
const setsAreEqual = <T>(a: Set<T>, b: Set<T>) =>
  a.size === b.size && [...a].every((value) => b.has(value));

export default setsAreEqual;
