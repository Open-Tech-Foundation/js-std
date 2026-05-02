import { first } from '../../src';

describe('Array', () => {
  test('first', () => {
    expect(first([1, 2, 3])).toBe(1);
    expect(first(['a', 'b', 'c'])).toBe('a');
    expect(first([])).toBeUndefined();
    expect(first()).toBeUndefined();
    expect(first([undefined, 2])).toBeUndefined();
    expect(first([null, 2])).toBeNull();
  });
});
