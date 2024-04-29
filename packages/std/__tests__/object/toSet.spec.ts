import { toSet } from '../../src';

describe('Object', () => {
  test('toSet', () => {
    expect(toSet({}, 'a', null)).toEqual({ a: null });

    expect(toSet({}, 'a', 1)).toEqual({ a: 1 });

    expect(toSet({}, 'a.b', 25)).toEqual({ a: { b: 25 } });

    expect(toSet({}, 'user.email', 'user@example.com')).toEqual({
      user: { email: 'user@example.com' },
    });

    const obj = { name: 'x' };
    const newObj = toSet(obj, 'name', 'xxx');
    expect(newObj.name).toBe('xxx');

    expect(toSet({}, '0', 'Apple')).toEqual({
      '0': 'Apple',
    });

    expect(toSet({}, 'fruits[0]', 'Apple')).toEqual({
      fruits: ['Apple'],
    });

    expect(toSet({ fruits: ['Apple'] }, 'fruits[0]', 'Mango')).toEqual({
      fruits: ['Mango'],
    });

    expect(toSet({ fruits: ['Apple'] }, 'fruits[1]', 'Mango')).toEqual({
      fruits: ['Apple', 'Mango'],
    });

    expect(toSet({ a: [{ b: { c: 3 } }] }, 'a[0].b.c', 4)).toEqual({
      a: [{ b: { c: 4 } }],
    });
  });

  test('updating values', () => {
    expect(toSet({}, 'a', () => 1)).toEqual({ a: 1 });
    expect(toSet({ a: 1 }, 'a', (val) => val + 1)).toEqual({ a: 2 });
    expect(
      toSet({ a: 1, b: [2] }, 'b', (arr) => {
        arr.unshift(1);
        return arr;
      })
    ).toEqual({
      a: 1,
      b: [1, 2],
    });
    const fn = (a, b) => a ** b;
    expect(toSet({ a: 1 }, 'b', (val) => fn)).toEqual({ a: 1, b: fn });
  });
});
