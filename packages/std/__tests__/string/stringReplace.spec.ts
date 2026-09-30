import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import { stringReplace } from '../../src';

describe('String > stringReplace', () => {
  test('invalid replace', () => {
    expect(stringReplace('abc', null, { replacement: 'x' })).toBe('abc');
    expect(stringReplace('abc', 'a', { replacement: null } as never)).toBe(
      'nullbc',
    );
  });

  test('single replace', () => {
    expect(stringReplace('abc', 'a', { replacement: 'x' })).toBe('xbc');
    expect(stringReplace('a.b.c', '.', { replacement: '-' })).toBe('a-b.c');
  });

  test('multi replace', () => {
    expect(stringReplace('abbc', 'b', { replacement: '', all: true })).toBe(
      'ac',
    );
    expect(
      stringReplace('aBbBc', 'B', {
        replacement: '',
        all: true,
        case: true,
      }),
    ).toBe('ac');
  });

  test('regexp replace', () => {
    const paragraph = "I think Ruth's dog is cuter than your dog!";
    const regex = /dog/;
    expect(stringReplace(paragraph, regex, { replacement: 'ferret' })).toBe(
      "I think Ruth's ferret is cuter than your dog!",
    );
  });

  test('regexp replace with ignore case', () => {
    const str = 'Twas the night before Xmas...';
    expect(
      stringReplace(str, /xmas/, { replacement: 'Christmas', case: true }),
    ).toBe('Twas the night before Christmas...');
  });

  test('regexp replace with global', () => {
    const str = 'Apples are round, and apples are juicy.';
    expect(
      stringReplace(str, /apple/, { replacement: 'orange', all: true }),
    ).toBe('Apples are round, and oranges are juicy.');
  });

  test('regexp replace with global & ignore case', () => {
    const str = 'Apples are round, and apples are juicy.';
    expect(
      stringReplace(str, /apple/, {
        replacement: 'Orange',
        all: true,
        case: true,
      }),
    ).toBe('Oranges are round, and Oranges are juicy.');
  });

  test('preserves regular expression flags', () => {
    expect(stringReplace('a\nb', /a.b/s, { replacement: 'x' })).toBe('x');
  });

  test('Replacement fn', () => {
    function convert(str, p1) {
      return `${((p1 - 32) * 5) / 9}C`;
    }
    const test = /(-?\d+(?:\.\d*)?)F\b/;
    expect(stringReplace('212F', test, { replacement: convert })).toBe('100C');
  });
});
