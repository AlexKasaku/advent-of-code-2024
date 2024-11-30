import { createAndInitArray, createArray } from './createArray';

describe('createArray', () => {
  test('1d array', () => {
    expect(createArray(0)).toEqual([]);
    expect(createArray(1)).toEqual([undefined]);
    expect(createArray(2)).toEqual([undefined, undefined]);
  });

  test('2d array', () => {
    expect(createArray(0, 1)).toEqual([]);
    expect(createArray(1, 1)).toEqual([[undefined]]);
    expect(createArray(2, 1)).toEqual([[undefined], [undefined]]);
    expect(createArray(2, 2)).toEqual([
      [undefined, undefined],
      [undefined, undefined],
    ]);
  });

  test('3d array', () => {
    expect(createArray(2, 2, 2)).toEqual([
      [
        [undefined, undefined],
        [undefined, undefined],
      ],
      [
        [undefined, undefined],
        [undefined, undefined],
      ],
    ]);
  });
});

describe('createAndInitArray', () => {
  test('1d array with flat values', () => {
    expect(createAndInitArray(() => 1, 0)).toEqual([]);
    expect(createAndInitArray(() => 1, 1)).toEqual([1]);
    expect(createAndInitArray(() => 1, 2)).toEqual([1, 1]);
  });

  test('1d array with callback using index', () => {
    expect(createAndInitArray((x) => x, 1)).toEqual([0]);
    expect(createAndInitArray((x) => x, 2)).toEqual([0, 1]);
  });

  test('2d array with flat values', () => {
    expect(createAndInitArray(() => 1, 0, 0)).toEqual([]);
    expect(createAndInitArray(() => 1, 1, 1)).toEqual([[1]]);
    expect(createAndInitArray(() => 1, 2, 2)).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  test('2d array with callback using index', () => {
    expect(createAndInitArray((x, y) => (x + 1) * (y + 1), 2, 2)).toEqual([
      [1, 2],
      [2, 4],
    ]);
  });
});
