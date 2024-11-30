import stringIntersect from './stringIntersect';

describe('stringIntersect', () => {
  it.each([
    ['ab', 'cd', ''],
    ['abc', 'cd', 'c'],
    ['abc', 'bcd', 'bc'],
    ['acb', 'bc', 'cb'],
  ])('works', (a, b, expected) => {
    expect(stringIntersect(a, b)).toEqual(expected);
  });

  it.each([
    ['aab', 'cd', ''],
    ['abbc', 'cd', 'c'],
    ['abbc', 'bcd', 'bc'],
    ['acccbbb', 'bc', 'cb'],
  ])('removes duplicates from source', (a, b, expected) => {
    expect(stringIntersect(a, b)).toEqual(expected);
  });
});
