import { stringInsertAt } from '../../src';

describe('String > stringInsertAt', () => {
  test('stringInsertAt', () => {
    expect(() => stringInsertAt()).toThrow();
    expect(() => stringInsertAt('abc', -1, 'x')).toThrow(
      'The index must be a non-negative integer.',
    );
    expect(() => stringInsertAt('abc', 1.5, 'x')).toThrow(
      'The index must be a non-negative integer.',
    );
    expect(stringInsertAt('')).toBe('');
    expect(stringInsertAt('', 0)).toBe('');
    expect(stringInsertAt('', 1, 'abc')).toBe('abc');
    expect(stringInsertAt('a', 0, 'b')).toBe('ba');
    expect(stringInsertAt('a', 1, 'b')).toBe('ab');
    expect(stringInsertAt('a', 1, 'bc')).toBe('abc');
    expect(stringInsertAt('foo baz', 3, ' bar')).toBe('foo bar baz');
    expect(stringInsertAt('I  🍊', 2, 'ate an')).toBe('I ate an 🍊');
    expect(stringInsertAt('IU', 1, '❤️')).toBe('I❤️U');
  });
});
