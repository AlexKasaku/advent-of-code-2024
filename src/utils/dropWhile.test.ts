import dropWhile from './dropWhile';

describe('dropWhile', () => {
  it.each([
    [
      [-4, -2, 0, 1, 2, -3],
      [-4, -2, 0, 1, 2, -3],
    ],
    [
      [4, -2, 0, 1, 2, -3],
      [-2, 0, 1, 2, -3],
    ],
    [
      [1, 2, -3, 4],
      [-3, 4],
    ],
    [[1, 2], []],
    [[1], []],
  ])('works with dropping positive integers', (array, expected) => {
    expect(dropWhile(array, (x) => x > 0)).toEqual(expected);
  });
});
