import { capitalize } from '../../lib/index.js';

describe('String', () => {
  test('capitalize', () => {
    expect(() => capitalize()).toThrow();
    expect(capitalize('')).toBe('');
    expect(capitalize('a')).toBe('A');
    expect(capitalize('ab')).toBe('Ab');
    expect(capitalize('FOO')).toBe('Foo');
    expect(capitalize('the quick brown fox')).toBe('The quick brown fox');
    expect(capitalize('the Quick Brown FOX')).toBe('The quick brown fox');
    expect(capitalize('1apple')).toBe('1apple');
    expect(capitalize('$1')).toBe('$1');
    expect(capitalize('1 usd')).toBe('1 usd');
  });
});
