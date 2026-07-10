import {
  kebabCase,
  pad,
  repeat,
  snakeCase,
  titleCase,
  trim,
  truncate,
  words,
} from '../../src';

describe('String Utils', () => {
  test('snakeCase', () => {
    expect(snakeCase('Foo Bar')).toBe('foo_bar');
    expect(snakeCase('fooBar')).toBe('foo_bar');
    expect(snakeCase('--FOO-BAR--')).toBe('foo_bar');
  });

  test('kebabCase', () => {
    expect(kebabCase('Foo Bar')).toBe('foo-bar');
    expect(kebabCase('fooBar')).toBe('foo-bar');
    expect(kebabCase('__FOO_BAR__')).toBe('foo-bar');
  });

  test('titleCase', () => {
    expect(titleCase('hello world')).toBe('Hello World');
    expect(titleCase('foo-bar')).toBe('Foo Bar');
    expect(titleCase('CAMEL_CASE')).toBe('Camel Case');
  });

  test('truncate', () => {
    expect(truncate('hi-package', 8)).toBe('hi-pa...');
    expect(truncate('hi-package', 5, '---')).toBe('hi---');
    expect(truncate('hi', 5)).toBe('hi');
    expect(truncate('😀😃😄😁', 4)).toBe('😀...');
    expect(() => truncate('hello', -1)).toThrow(
      'Length must be greater than or equal to 0.',
    );
    expect(() => truncate('hello', 1.5)).toThrow(
      'Length must be a finite integer.',
    );
  });

  test('trim', () => {
    expect(trim('  abc  ')).toBe('abc');
    expect(trim('-_-abc-_-', '_-')).toBe('abc');
    expect(trim('xxhelloxx', 'x')).toBe('hello');
  });

  test('words', () => {
    expect(words('fred, barney, & pebbles')).toEqual([
      'fred',
      'barney',
      'pebbles',
    ]);
    expect(words('fred, barney, & pebbles', /[^, ]+/g)).toEqual([
      'fred',
      'barney',
      '&',
      'pebbles',
    ]);
    expect(words('camelCase')).toEqual(['camel', 'Case']);
    expect(words('a+b+c', '+')).toEqual(['+', '+']);
    expect(words('a.b.c', '.')).toEqual(['.', '.']);
  });

  test('pad', () => {
    expect(pad('abc', 8)).toBe('  abc   ');
    expect(pad('abc', 8, '_-')).toBe('_-abc_-_');
    expect(pad('abc', 3)).toBe('abc');
    expect(() => pad('abc', -1)).toThrow(
      'Length must be greater than or equal to 0.',
    );
    expect(() => pad('abc', Number.POSITIVE_INFINITY)).toThrow(
      'Length must be a finite integer.',
    );
  });

  test('repeat', () => {
    expect(repeat('*', 3)).toBe('***');
    expect(repeat('abc', 2)).toBe('abcabc');
    expect(repeat('abc', 0)).toBe('');
    expect(() => repeat('abc', -1)).toThrow(
      'Count must be greater than or equal to 0.',
    );
    expect(() => repeat('abc', 1.5)).toThrow(
      'Count must be a finite integer.',
    );
  });
});
