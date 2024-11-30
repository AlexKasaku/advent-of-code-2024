import buildPrimeArray from './buildPrimeArray';
import primes from './primes.json';

describe('buildPrimeArray', () => {
  it.each([
    [4, [2, 3]],
    [5, [2, 3, 5]],
    [6, [2, 3, 5]],
    [10, [2, 3, 5, 7]],
    [11, [2, 3, 5, 7, 11]],
    [
      100,
      [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
        71, 73, 79, 83, 89, 97,
      ],
    ],
  ])('builds a prime array up to max', (max, expected) => {
    expect(buildPrimeArray(max)).toEqual(expected);
  });

  it('can build large prime array', () => {
    expect(buildPrimeArray(1299709)).toEqual(primes as number[]);
  });
});
