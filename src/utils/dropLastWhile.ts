/**
 * Removes elements from an end of an array whilst the predicate condition is met.
 * @param array The array to compare against
 * @param predicate The predicate, every element that this returns true from will be removed until one does not
 * @returns The updated array with the matching elements removed
 */
const dropLastWhile = <T>(array: T[], predicate: (arg: T) => boolean) => {
  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[array.length - 1 - i])) {
      return array.slice(0, array.length - i);
    }
  }
  return [];
};

export default dropLastWhile;
