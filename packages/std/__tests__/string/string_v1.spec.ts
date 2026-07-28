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

  test('slugify transliterates letters with no decomposition', () => {
    // Previously these were dropped rather than converted, so `Straße` slugged
    // to 'strae' and `Ølberg` to 'lberg'.
    expect(slugify('Straße')).toBe('strasse');
    expect(slugify('Ølberg')).toBe('olberg');
    expect(slugify('Œuvre')).toBe('oeuvre');
    expect(slugify('Łódź')).toBe('lodz');
    expect(slugify('Đorđe')).toBe('dorde');
    expect(slugify('Ægir')).toBe('aegir');
    expect(slugify('Þór')).toBe('thor');
  });
});
