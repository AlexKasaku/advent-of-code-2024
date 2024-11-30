import setsAreEqual from './setsAreEqual';

describe('setsAreEqual', () => {
  it.each([
    [[], []],
    [[1], [1]],
    [
      [1, 2],
      [2, 1],
    ],
    [
      [1, 2],
      [2, 1, 1, 2],
    ],
  ])('numerical sets are matched', (a, b) => {
    expect(setsAreEqual(new Set(a), new Set(b))).toEqual(true);
  });

  it.each([
    [[1], []],
    [[], [1]],
    [
      [1, 2],
      [2, 1, 3],
    ],
    [
      [1, 2],
      [2, 3],
    ],
  ])('numerical sets are matched', (a, b) => {
    expect(setsAreEqual(new Set(a), new Set(b))).toEqual(false);
  });
});
