import { getInObj } from '../../src';

describe('Object', () => {
  test('getInObj', () => {
    expect(getInObj({}, '')).toBe(undefined);

    expect(getInObj({}, 'a')).toBe(undefined);

    expect(getInObj({ a: null }, 'a')).toBe(null);

    expect(getInObj({ a: 1 }, 'a')).toBe(1);

    expect(getInObj({ a: { b: 25 } }, 'a.b')).toBe(25);

    expect(
      getInObj({ user: { email: 'user@example.com' } }, 'user.email')
    ).toBe('user@example.com');

    expect(getInObj({ fruits: ['Apple'] }, 'fruits[0]')).toBe('Apple');

    expect(getInObj({ fruits: ['Apple', 'Mango'] }, 'fruits')).toEqual([
      'Apple',
      'Mango',
    ]);

    expect(getInObj({ a: [{ b: { c: 99 } }] }, 'a[0].b.c')).toBe(99);
  });
});
