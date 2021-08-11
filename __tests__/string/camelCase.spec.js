import { camelCase } from '../../lib/index.esm.js';

describe('String', () => {
  test('camelCase', () => {
    expect(() => camelCase()).toThrow();
    expect(camelCase('a')).toBe('a');
    expect(camelCase('A')).toBe('a');
    expect(camelCase('aB')).toBe('aB');
    expect(camelCase('AB')).toBe('ab');
    expect(camelCase('abc')).toBe('abc');
    expect(camelCase('i phone')).toBe('iPhone');
    expect(camelCase('i-phone')).toBe('iPhone');
    expect(camelCase('i_phone')).toBe('iPhone');
    expect(camelCase('i.phone')).toBe('iPhone');
    expect(camelCase('The Quick Brown Fox')).toBe('theQuickBrownFox');
    expect(camelCase('The Quick BROWNFox')).toBe('theQuickBrownFox');
    expect(camelCase('The Quick BROWNFoxJUMPS')).toBe('theQuickBrownFoxJumps');
    expect(camelCase('TheQuickBrownFox')).toBe('theQuickBrownFox');
    expect(camelCase('The quick.brown_fox-jumps OVER the lazy-dog.')).toBe(
      'theQuickBrownFoxJumpsOverTheLazyDog'
    );
    expect(camelCase('--foo.bar')).toBe('fooBar');
    expect(camelCase('Foo Bar')).toBe('fooBar');
    expect(camelCase('__FOO_BAR__')).toBe('fooBar');
    expect(camelCase('foo,bar')).toBe('fooBar');
    expect(camelCase('1apple')).toBe('1apple');
    expect(camelCase('1 apple')).toBe('1Apple');
    expect(camelCase('fooBAR')).toBe('fooBar');
    expect(camelCase('fooBARBaz')).toBe('fooBarBaz');
  });
});
