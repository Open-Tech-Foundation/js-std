import { insertAt } from '../../lib/index.js';

describe('String', () => {
  test('insertAt', () => {
    expect(() => insertAt()).toThrow();
    expect(insertAt('')).toBe('');
    expect(insertAt('', 0)).toBe('');
    expect(insertAt('', 1, 'abc')).toBe('');
    expect(insertAt('a', 0, 'b')).toBe('ba');
    expect(insertAt('a', 1, 'b')).toBe('ab');
    expect(insertAt('a', 1, 'bc')).toBe('abc');
    expect(insertAt('foo baz', 3, ' bar')).toBe('foo bar baz');
    expect(insertAt('I want apple', 6, ' an')).toBe('I want an apple');
    expect(insertAt('IU', 1, '❤️')).toBe('I❤️U');
  });
});
