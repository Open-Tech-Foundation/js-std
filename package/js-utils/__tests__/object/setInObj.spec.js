import { setInObj } from '../../src';

describe('Object', () => {
  test('setInObj', () => {
    expect(() => setInObj()).toThrow();

    expect(setInObj({}, '')).toEqual({});

    expect(setInObj({}, 'a')).toEqual({ a: undefined });

    expect(setInObj({}, 'a', null)).toEqual({ a: null });

    expect(setInObj({}, 'a', 1)).toEqual({ a: 1 });

    expect(setInObj({}, 'a.b', 25)).toEqual({ a: { b: 25 } });

    expect(setInObj({}, 'user.email', 'user@example.com')).toEqual({
      user: { email: 'user@example.com' },
    });

    const obj = { name: 'x' };
    setInObj(obj, 'name', 'xxx');
    expect(obj.name).toBe('xxx');

    expect(setInObj({}, 'fruits[0]', 'Apple')).toEqual({
      fruits: ['Apple'],
    });

    expect(setInObj({ fruits: ['Apple'] }, 'fruits[0]', 'Mango')).toEqual({
      fruits: ['Mango'],
    });

    expect(setInObj({ fruits: ['Apple'] }, 'fruits[1]', 'Mango')).toEqual({
      fruits: ['Apple', 'Mango'],
    });

    expect(setInObj({ a: [{ b: { c: 3 } }] }, 'a[0].b.c', 4)).toEqual({
      a: [{ b: { c: 4 } }],
    });
  });
});
