import { escapeRegExp, slugify } from '../../src';

describe('String Utilities v1', () => {
  test('escapeRegExp', () => {
    expect(escapeRegExp('[opentf](https://opentf.org/)')).toBe(
      '\\[opentf\\]\\(https://opentf\\.org/\\)',
    );
  });

  test('slugify', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('Café au Lait')).toBe('cafe-au-lait');
    expect(slugify('  Trim and Dash  ')).toBe('trim-and-dash');
    expect(slugify('Special characters like @#$%')).toBe(
      'special-characters-like',
    );
  });
});
