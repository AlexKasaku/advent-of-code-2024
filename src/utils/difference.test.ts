import difference from './difference';

describe('difference', () => {
  it.each([
    [[1], [2], [1]],
    [
      [1, 2],
      [3, 4],
      [1, 2],
    ],
    [[1, 2], [2, 3], [1]],
    [[1, 2, 3], [2, 3, 4], [1]],
    [[1], [1], []],
    [[1, 2], [1, 2], []],
    [[1, 2], [2, 1], []],
  ])('works', (a, b, expected) => {
    expect(difference(a, b)).toEqual(expected);
  });
});
