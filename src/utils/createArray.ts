/**
 * Creates an n-dimensional array with undefined values
 * @param sizes Dimensions of array to return
 * @returns Array
 */
export const createArray = (...sizes: number[]) => {
  const arr = new Array(sizes[0] || 0);
  let i = arr.length;

  if (sizes.length > 1) {
    while (i--) arr[arr.length - 1 - i] = createArray(...sizes.slice(1));
  }

  return arr;
};

/**
 * Creates an n-dimensional array with callback for initializing each value
 * @param initCallback Callback to provide initial value for array at given index
 * @param sizes Dimensions of array to return
 * @returns Array
 */
export const createAndInitArray = <T>(
  initCallback: (...indexes: number[]) => T,
  ...sizes: number[]
) => innerCreateArray([], initCallback, ...sizes);

const innerCreateArray = <T>(
  indexes: number[],
  initCallback: (...indexes: number[]) => T,
  ...sizes: number[]
) => {
  const arr = new Array(sizes[0] || 0);
  let i = arr.length;

  if (sizes.length > 1) {
    while (i--) {
      const arrIndex = arr.length - 1 - i;
      arr[arrIndex] = innerCreateArray(
        [...indexes, arrIndex],
        initCallback,
        ...sizes.slice(1),
      );
    }
  } else {
    // Fill this array with callback
    while (i--) {
      const arrIndex = arr.length - 1 - i;
      arr[arrIndex] = initCallback(...indexes, arrIndex);
    }
  }

  return arr;
};
