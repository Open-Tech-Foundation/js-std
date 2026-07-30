import { constantCase, snakeCase } from '../../src';

describe('String > constantCase', () => {
  test('converts the usual spellings', () => {
    expect(constantCase('Foo Bar')).toBe('FOO_BAR');
    expect(constantCase('fooBar')).toBe('FOO_BAR');
    expect(constantCase('FooBar')).toBe('FOO_BAR');
    expect(constantCase('foo bar')).toBe('FOO_BAR');
    expect(constantCase('foo-bar')).toBe('FOO_BAR');
    expect(constantCase('foo_bar')).toBe('FOO_BAR');
    expect(constantCase('foo.bar')).toBe('FOO_BAR');
    expect(constantCase('foo,bar')).toBe('FOO_BAR');
  });

  test('strips surrounding separators', () => {
    expect(constantCase('--FOO-BAR--')).toBe('FOO_BAR');
    expect(constantCase('__foo_bar__')).toBe('FOO_BAR');
  });

  test('splits runs of capitals at the word boundary', () => {
    expect(constantCase('XMLHttpRequest')).toBe('XML_HTTP_REQUEST');
    expect(constantCase('fooBARBaz')).toBe('FOO_BAR_BAZ');
    expect(constantCase('The Quick BROWNFox')).toBe('THE_QUICK_BROWN_FOX');
  });

  test('keeps digits as their own word', () => {
    expect(constantCase('1 apple')).toBe('1_APPLE');
    expect(constantCase('v2 endpoint')).toBe('V_2_ENDPOINT');
  });

  test('handles the short cases', () => {
    expect(constantCase('a')).toBe('A');
    expect(constantCase('A')).toBe('A');
    expect(constantCase('')).toBe('');
    expect(constantCase('---')).toBe('');
  });

  test('is snakeCase in upper case', () => {
    const inputs = [
      'Foo Bar',
      'fooBar',
      '--FOO-BAR--',
      'XMLHttpRequest',
      'The quick.brown_fox-jumps OVER the lazy-dog.',
      '',
    ];

    for (const input of inputs) {
      expect(constantCase(input)).toBe(snakeCase(input).toUpperCase());
    }
  });
});
