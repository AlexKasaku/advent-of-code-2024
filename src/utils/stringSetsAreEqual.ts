/**
 * Determines if two strings have equal unique characters, i.e. their strings as a Set have their sizes match and every element in set A is in set B
 * @param a String a to compare
 * @param b String b to compare
 * @returns true if sets match, false otherwise
 */
const stringsAreEqualSets = (a: string, b: string) => {
  const aSet = new Set(a);
  const bSet = new Set(b);
  return aSet.size === bSet.size && [...aSet].every((value) => bSet.has(value));
};

export default stringsAreEqualSets;
