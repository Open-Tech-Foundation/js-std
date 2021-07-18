import { camelCase } from '../../lib/index.js';

describe('String', () => {
  test('camelCase', () => {
    expect(camelCase('a')).toMatch('a');
    expect(camelCase('A')).toMatch('a');
    expect(camelCase('aB')).toMatch('aB');
    expect(camelCase('AB')).toMatch('aB');
    expect(camelCase('abc')).toMatch('abc');
    expect(camelCase('i phone')).toMatch('iPhone');
    expect(camelCase('i-phone')).toMatch('iPhone');
    expect(camelCase('i_phone')).toMatch('iPhone');
    expect(camelCase('i.phone')).toMatch('iPhone');
    expect(camelCase('The Quick Brown Fox')).toMatch('theQuickBrownFox');
    expect(camelCase('TheQuickBrownFox')).toMatch('theQuickBrownFox');
    expect(camelCase('The quick.brown_fox-jumps over the lazy-dog.')).toMatch(
      'theQuickBrownFoxJumpsOverTheLazyDog'
    );
    expect(camelCase('--foo.bar')).toMatch('fooBar');
    expect(camelCase('Foo Bar')).toMatch('fooBar');
    expect(camelCase('__FOO_BAR__')).toMatch('fooBar');
    expect(camelCase('foo,bar')).toMatch('fooBar');
    expect(camelCase('1apple')).toMatch('1apple');
    expect(camelCase('1 apple')).toMatch('1Apple');
  });
});
