import { get } from '../../src';

describe('Object > get', () => {
  test('invalid', () => {
    expect(get()).toBe(undefined);
    expect(get(undefined)).toBe(undefined);
    expect(get(undefined, '')).toBe(undefined);
  });

  test('valid', () => {
    expect(get({}, '')).toBe(undefined);
    expect(get({}, '', undefined)).toBe(undefined);
    expect(get({}, '', null)).toBe(null);

    expect(get({}, 'a')).toBe(undefined);

    expect(get({ a: null }, 'a')).toBe(null);

    expect(get({ a: 1 }, 'a')).toBe(1);

    expect(get({ a: { b: 25 } }, 'a.b')).toBe(25);

    expect(get({ user: { email: 'user@example.com' } }, 'user.email')).toBe(
      'user@example.com'
    );

    expect(get({ fruits: ['Apple'] }, 'fruits[0]')).toBe('Apple');

    expect(get({ fruits: ['Apple', 'Mango'] }, 'fruits')).toEqual([
      'Apple',
      'Mango',
    ]);

    expect(get({ a: [{ b: { c: 99 } }] }, 'a[0].b.c')).toBe(99);
    expect(get({ a: [{ b: { c: 99 } }] }, ['a', '0', 'b', 'c'])).toBe(99);
  });
});
