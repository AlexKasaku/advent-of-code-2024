import dropLastWhile from './dropLastWhile';

describe('dropLastWhile', () => {
  it.each([
    [
      [-4, -2, 0, 1, 2, -3],
      [-4, -2, 0, 1, 2, -3],
    ],
    [
      [4, -2, 0, 1, 2, 3],
      [4, -2, 0],
    ],
    [
      [1, 2, -3, 4],
      [1, 2, -3],
    ],
    [[1, 2], []],
    [[1], []],
  ])('works with dropping positive integers', (array, expected) => {
    expect(dropLastWhile(array, (x) => x > 0)).toEqual(expected);
  });
});
