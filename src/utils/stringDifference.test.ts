import stringDifference from './stringDifference';

describe('stringDifference', () => {
  it.each([
    ['ab', 'cd', 'ab'],
    ['abc', 'cd', 'ab'],
    ['adbc', 'bc', 'ad'],
    ['dacb', 'bc', 'da'],
    ['abcdefg', '', 'abcdefg'],
  ])('works (%p - %p - %p)', (a, b, expected) => {
    expect(stringDifference(a, b)).toEqual(expected);
  });

  it.each([
    ['aab', 'cd', 'ab'],
    ['abbc', 'cd', 'ab'],
    ['abbc', 'bcd', 'a'],
    ['acccbbb', 'bc', 'a'],
    ['aabbccddeeeefffgg', '', 'abcdefg'],
  ])('removes duplicates from source (%p - %p - %p)', (a, b, expected) => {
    expect(stringDifference(a, b)).toEqual(expected);
  });
});
