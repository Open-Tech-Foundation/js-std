import { toPath } from '../../src';

describe('Object > toPath', () => {
  test('invalid', () => {
    expect(toPath()).toEqual([]);
  });

  test('valid', () => {
    expect(toPath('a.b.c')).toEqual(['a', 'b', 'c']);
    expect(toPath('a[0].b.c')).toEqual(['a', 0, 'b', 'c']);
  });
});
