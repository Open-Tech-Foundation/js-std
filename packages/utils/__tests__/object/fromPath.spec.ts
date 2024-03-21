import { fromPath } from '../../src';

describe('Object > fromPath', () => {
  test('invalid', () => {
    expect(fromPath()).toBe('');
  });

  test('valid', () => {
    expect(fromPath(['a', '0', 'b', 'c'])).toBe('a[0].b.c');
    expect(fromPath(['a', 1, 'b', 'c'])).toBe('a[1].b.c');
    expect(fromPath(['a', 'b.c', 'd'])).toBe('a.b.c.d');
  });
});
