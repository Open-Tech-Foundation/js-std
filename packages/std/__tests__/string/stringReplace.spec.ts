import { stringReplace } from '../../src';

describe('String > stringReplace', () => {
  test('invalid replace', () => {
    expect(stringReplace('abc', null, 'x')).toBe('abc');
    expect(stringReplace('abc', 'a', null)).toBe('nullbc');
  });

  test('single replace', () => {
    expect(stringReplace('abc', 'a', 'x')).toBe('xbc');
  });

  test('multi replace', () => {
    expect(stringReplace('abbc', 'b', '', { all: true })).toBe('ac');
    expect(stringReplace('aBbBc', 'B', '', { all: true, case: true })).toBe(
      'ac',
    );
  });

  test('regexp replace', () => {
    const paragraph = "I think Ruth's dog is cuter than your dog!";
    const regex = /dog/;
    expect(stringReplace(paragraph, regex, 'ferret')).toBe(
      "I think Ruth's ferret is cuter than your dog!",
    );
  });

  test('regexp replace with ignore case', () => {
    const str = 'Twas the night before Xmas...';
    expect(stringReplace(str, /xmas/, 'Christmas', { case: true })).toBe(
      'Twas the night before Christmas...',
    );
  });

  test('regexp replace with global', () => {
    const str = 'Apples are round, and apples are juicy.';
    expect(stringReplace(str, /apple/, 'orange', { all: true })).toBe(
      'Apples are round, and oranges are juicy.',
    );
  });

  test('regexp replace with global & ignore case', () => {
    const str = 'Apples are round, and apples are juicy.';
    expect(
      stringReplace(str, /apple/, 'Orange', { all: true, case: true }),
    ).toBe('Oranges are round, and Oranges are juicy.');
  });

  test('Replacement fn', () => {
    function convert(str, p1) {
      return `${((p1 - 32) * 5) / 9}C`;
    }
    const test = /(-?\d+(?:\.\d*)?)F\b/;
    expect(stringReplace('212F', test, convert)).toBe('100C');
  });
});
