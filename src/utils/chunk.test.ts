import chunk from './chunk';

describe('chunk', () => {
  it.each([
    [[1, 2, 3, 4, 5], 1, [[1], [2], [3], [4], [5]]],
    [[1, 2, 3, 4, 5], 2, [[1, 2], [3, 4], [5]]],
    [
      [1, 2, 3, 4, 5],
      3,
      [
        [1, 2, 3],
        [4, 5],
      ],
    ],
    [[1, 2, 3, 4, 5], 5, [[1, 2, 3, 4, 5]]],
    [[1, 2, 3, 4, 5], 6, [[1, 2, 3, 4, 5]]],
  ])('works', (group, size, expected) => {
    expect(chunk(group, size)).toEqual(expected);
  });
});
