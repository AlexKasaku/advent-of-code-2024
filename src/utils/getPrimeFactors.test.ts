import buildPrimeArray from './buildPrimeArray';
import getPrimeFactors from './getPrimeFactors';

describe('getPrimeFactors', () => {
  const testCases = [
    [1, []],
    [2, [{ factor: 2, power: 1 }]],
    [3, [{ factor: 3, power: 1 }]],
    [4, [{ factor: 2, power: 2 }]],
    [
      6,
      [
        { factor: 2, power: 1 },
        { factor: 3, power: 1 },
      ],
    ],
    [
      10,
      [
        { factor: 2, power: 1 },
        { factor: 5, power: 1 },
      ],
    ],
    [15015, [3, 5, 7, 11, 13].map((i) => ({ factor: i, power: 1 }))],
    [669384293, [29, 47, 61, 83, 97].map((i) => ({ factor: i, power: 1 }))],
    [169, [{ factor: 13, power: 2 }]],
    [
      1183,
      [
        { factor: 7, power: 1 },
        { factor: 13, power: 2 },
      ],
    ],
  ];

  describe('without a prime map', () => {
    it.each(testCases as [number, number[]][])(
      'returns correct prime factors for %p',
      (number: number, expected: number[]) => {
        expect(getPrimeFactors(number)).toEqual(expected);
      },
    );
  });

  describe('with a prime map', () => {
    const primeMap = buildPrimeArray(100);

    it.each(testCases as [number, number[]][])(
      'returns correct prime factors for %p',
      (number: number, expected: number[]) => {
        expect(getPrimeFactors(number, primeMap)).toEqual(expected);
      },
    );
  });
});
