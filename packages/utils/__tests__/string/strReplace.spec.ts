import { strReplace } from '../../src';

describe('String > strReplace', () => {
  test('invalid replace', () => {
    expect(strReplace('abc', null, 'x')).toBe('abc');
    expect(strReplace('abc', 'a', null)).toBe('nullbc');
  });

  test('single replace', () => {
    expect(strReplace('abc', 'a', 'x')).toBe('xbc');
  });

  test('multi replace', () => {
    expect(strReplace('abbc', 'b', '', { all: true })).toBe('ac');
    expect(strReplace('aBbBc', 'B', '', { all: true, case: true })).toBe('ac');
  });

  test('regexp replace', () => {
    const paragraph = "I think Ruth's dog is cuter than your dog!";
    const regex = /dog/;
    expect(strReplace(paragraph, regex, 'ferret')).toBe(
      "I think Ruth's ferret is cuter than your dog!"
    );
  });

  test('regexp replace with ignore case', () => {
    const str = 'Twas the night before Xmas...';
    expect(strReplace(str, /xmas/, 'Christmas', { case: true })).toBe(
      'Twas the night before Christmas...'
    );
  });

  test('regexp replace with global', () => {
    const str = 'Apples are round, and apples are juicy.';
    expect(strReplace(str, /apple/, 'orange', { all: true })).toBe(
      'Apples are round, and oranges are juicy.'
    );
  });

  test('regexp replace with global & ignore case', () => {
    const str = 'Apples are round, and apples are juicy.';
    expect(strReplace(str, /apple/, 'Orange', { all: true, case: true })).toBe(
      'Oranges are round, and Oranges are juicy.'
    );
  });

  test('Replacement fn', () => {
    function convert(str, p1) {
      return `${((p1 - 32) * 5) / 9}C`;
    }
    const test = /(-?\d+(?:\.\d*)?)F\b/;
    expect(strReplace('212F', test, convert)).toBe('100C');
  });
});
