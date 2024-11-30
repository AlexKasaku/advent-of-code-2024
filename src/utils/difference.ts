/**
 * Returns elements one array that cannot be found in a second array
 * @param one The array to pick elements from
 * @param two The array to compare against
 * @returns The unique elements from array one that do not appear in array two
 */
const difference = <T>(one: T[], two: T[]) =>
  one.filter((x) => !two.includes(x));

export default difference;
