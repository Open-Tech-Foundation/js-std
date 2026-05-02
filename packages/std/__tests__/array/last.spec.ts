import { last } from '../../src';

describe('Array', () => {
  test('last', () => {
    expect(last([1, 2, 3])).toBe(3);
    expect(last(['a', 'b', 'c'])).toBe('c');
    expect(last([])).toBeUndefined();
    expect(last()).toBeUndefined();
    expect(last([1, undefined])).toBeUndefined();
    expect(last([1, null])).toBeNull();
  });
});
