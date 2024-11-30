/**
 * Returns elements from one array that are also found in a second array
 * @param one The array to pick elements from
 * @param two The array to compare against
 * @returns The intersection of both arrays
 */
const intersect = <T>(one: T[], two: T[]) => one.filter((x) => two.includes(x));

export default intersect;
