import { set } from '../../src';

describe('Object', () => {
  test('set', () => {
    expect(set({}, 'a', null)).toEqual({ a: null });

    expect(set({}, 'a', 1)).toEqual({ a: 1 });

    expect(set({}, 'a.b', 25)).toEqual({ a: { b: 25 } });

    expect(set({}, 'user.email', 'user@example.com')).toEqual({
      user: { email: 'user@example.com' },
    });

    const obj = { name: 'x' };
    const newObj = set(obj, 'name', 'xxx');
    expect(newObj.name).toBe('xxx');

    expect(set({}, '0', 'Apple')).toEqual({
      '0': 'Apple',
    });

    expect(set({}, 'fruits[0]', 'Apple')).toEqual({
      fruits: ['Apple'],
    });

    expect(set({ fruits: ['Apple'] }, 'fruits[0]', 'Mango')).toEqual({
      fruits: ['Mango'],
    });

    expect(set({ fruits: ['Apple'] }, 'fruits[1]', 'Mango')).toEqual({
      fruits: ['Apple', 'Mango'],
    });

    expect(set({ a: [{ b: { c: 3 } }] }, 'a[0].b.c', 4)).toEqual({
      a: [{ b: { c: 4 } }],
    });
  });

  test('updating values', () => {
    expect(set({}, 'a', () => 1)).toEqual({ a: 1 });
    expect(set({ a: 1 }, 'a', (val) => val + 1)).toEqual({ a: 2 });
    expect(
      set({ a: 1, b: [2] }, 'b', (arr) => {
        arr.unshift(1);
        return arr;
      })
    ).toEqual({
      a: 1,
      b: [1, 2],
    });
    const fn = (a, b) => a ** b;
    expect(set({ a: 1 }, 'b', (val) => fn)).toEqual({ a: 1, b: fn });
  });
});
