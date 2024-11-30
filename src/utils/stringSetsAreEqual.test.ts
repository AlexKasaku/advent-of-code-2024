import stringSetsAreEqual from './stringSetsAreEqual';

describe('stringSetsAreEqual', () => {
  it.each([
    ['', ''],
    ['1', '1'],
    ['12', '21'],
    ['12', '2112'],
  ])('numerical sets are matched', (a, b) => {
    expect(stringSetsAreEqual(a, b)).toEqual(true);
  });

  it.each([
    ['1', ''],
    ['', '1'],
    ['12', '213'],
    ['12', '23'],
  ])('numerical sets are matched', (a, b) => {
    expect(stringSetsAreEqual(a, b)).toEqual(false);
  });
});
