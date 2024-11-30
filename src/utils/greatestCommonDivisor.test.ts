import greatestCommonDivisor from './greatestCommonDivisor';

describe('greatestCommonDivisor', () => {
  it.each([
    [4, 8, 4],
    [5, 8, 1],
    [6, 8, 2],
    [6, 9, 3],
    [9, 6, 3],
    [-6, -9, 3],
    [-6, 9, 3],
    [6, -9, 3],
  ])('for %p and %p, returns %p', (a, b, expected) => {
    expect(greatestCommonDivisor(a, b)).toEqual(expected);
  });
});
