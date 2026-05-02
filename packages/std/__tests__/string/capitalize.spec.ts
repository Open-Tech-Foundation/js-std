import { capitalize } from '../../src';

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
  });
});
