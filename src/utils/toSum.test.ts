import toSum from './toSum';

describe('toSum', () => {
  it.each([
    [[], 0],
    [[1], 1],
    [[1, 2], 3],
    [[1, 2, 3], 6],
    [[0, 0, 0, 1], 1],
    [[-1, 0, 1], 0],
  ])('works', (values, expected) => {
    expect(values.reduce(toSum, 0)).toEqual(expected);
  });
});
