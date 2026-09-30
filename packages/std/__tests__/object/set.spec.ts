import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import { set } from '../../src';

describe('Object', () => {
  test('set', () => {
    expect(set({}, 'a', { value: null })).toEqual({ a: null });

    expect(set({}, 'a', { value: 1 })).toEqual({ a: 1 });

    expect(set({}, 'a.b', { value: 25 })).toEqual({ a: { b: 25 } });

    expect(set({}, 'user.email', { value: 'user@example.com' })).toEqual({
      user: { email: 'user@example.com' },
    });

    const obj = { name: 'x' };
    const newObj = set(obj, 'name', { value: 'xxx' });
    expect(newObj.name).toBe('xxx');

    expect(set({}, '0', { value: 'Apple' })).toEqual({
      '0': 'Apple',
    });

    expect(set({}, 'fruits[0]', { value: 'Apple' })).toEqual({
      fruits: ['Apple'],
    });

    expect(set({ fruits: ['Apple'] }, 'fruits[0]', { value: 'Mango' })).toEqual(
      {
        fruits: ['Mango'],
      },
    );

    expect(set({ fruits: ['Apple'] }, 'fruits[1]', { value: 'Mango' })).toEqual(
      {
        fruits: ['Apple', 'Mango'],
      },
    );

    expect(set({ a: [{ b: { c: 3 } }] }, 'a[0].b.c', { value: 4 })).toEqual({
      a: [{ b: { c: 4 } }],
    });
  });

  test('updating values', () => {
    expect(set({}, 'a', { value: () => 1 })).toEqual({ a: 1 });
    expect(set({ a: 1 }, 'a', { value: (val) => val + 1 })).toEqual({ a: 2 });
    expect(
      set({ a: 1, b: [2] }, 'b', {
        value: (arr) => {
          arr.unshift(1);
          return arr;
        },
      }),
    ).toEqual({
      a: 1,
      b: [1, 2],
    });
    const fn = (a, b) => a ** b;
    expect(set({ a: 1 }, 'b', { value: (val) => fn })).toEqual({ a: 1, b: fn });
  });

  test('does not overwrite existing falsy intermediates', () => {
    const zeroObj = { a: 0 };
    expect(set(zeroObj, 'a.b', { value: 1 })).toBe(zeroObj);
    expect(zeroObj).toEqual({ a: 0 });

    const falseObj = { a: false };
    expect(set(falseObj, 'a.b', { value: 1 })).toBe(falseObj);
    expect(falseObj).toEqual({ a: false });

    const emptyStringObj = { a: '' };
    expect(set(emptyStringObj, 'a.b', { value: 1 })).toBe(emptyStringObj);
    expect(emptyStringObj).toEqual({ a: '' });

    const nullObj = { a: null };
    expect(set(nullObj, 'a.b', { value: 1 })).toBe(nullObj);
    expect(nullObj).toEqual({ a: null });
  });
});
