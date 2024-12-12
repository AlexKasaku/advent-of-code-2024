import transpose from './transpose';

describe('transpose', () => {
  it('works', () => {
    const value = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const expected = [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ];

    expect(transpose(value)).toEqual(expected);
  });
});
