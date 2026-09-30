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

import { toSet } from '../../src';

describe('Object', () => {
  test('toSet', () => {
    expect(toSet({}, 'a', { value: null })).toEqual({ a: null });

    expect(toSet({}, 'a', { value: 1 })).toEqual({ a: 1 });

    expect(toSet({}, 'a.b', { value: 25 })).toEqual({ a: { b: 25 } });

    expect(toSet({}, 'user.email', { value: 'user@example.com' })).toEqual({
      user: { email: 'user@example.com' },
    });

    const obj = { name: 'x' };
    const newObj = toSet(obj, 'name', { value: 'xxx' });
    expect(newObj.name).toBe('xxx');

    expect(toSet({}, '0', { value: 'Apple' })).toEqual({
      '0': 'Apple',
    });

    expect(toSet({}, 'fruits[0]', { value: 'Apple' })).toEqual({
      fruits: ['Apple'],
    });

    expect(toSet({ fruits: ['Apple'] }, 'fruits[0]', { value: 'Mango' })).toEqual({
      fruits: ['Mango'],
    });

    expect(toSet({ fruits: ['Apple'] }, 'fruits[1]', { value: 'Mango' })).toEqual({
      fruits: ['Apple', 'Mango'],
    });

    expect(toSet({ a: [{ b: { c: 3 } }] }, 'a[0].b.c', { value: 4 })).toEqual({
      a: [{ b: { c: 4 } }],
    });
  });

  test('updating values', () => {
    expect(toSet({}, 'a', { value: () => 1 })).toEqual({ a: 1 });
    expect(toSet({ a: 1 }, 'a', { value: (val) => val + 1 })).toEqual({ a: 2 });
    expect(
      toSet({ a: 1, b: [2] }, 'b', { value: (arr) => {
        arr.unshift(1);
        return arr;
      } }),
    ).toEqual({
      a: 1,
      b: [1, 2],
    });
    const fn = (a, b) => a ** b;
    expect(toSet({ a: 1 }, 'b', { value: (val) => fn })).toEqual({ a: 1, b: fn });
  });

  test('blocks unsafe prototype paths', () => {
    delete Object.prototype.polluted;

    const obj = { a: 1 };
    expect(toSet(obj, '__proto__.polluted', { value: true })).toBe(obj);
    expect(toSet(obj, 'constructor.prototype.polluted', { value: true })).toBe(obj);
    expect(toSet(obj, 'prototype.polluted', { value: true })).toBe(obj);
    expect(Object.prototype.polluted).toBeUndefined();

    delete Object.prototype.polluted;
  });

  test('does not overwrite existing falsy intermediates', () => {
    const zeroObj = { a: 0 };
    expect(toSet(zeroObj, 'a.b', { value: 1 })).toBe(zeroObj);
    expect(zeroObj).toEqual({ a: 0 });

    const falseObj = { a: false };
    expect(toSet(falseObj, 'a.b', { value: 1 })).toBe(falseObj);
    expect(falseObj).toEqual({ a: false });

    const emptyStringObj = { a: '' };
    expect(toSet(emptyStringObj, 'a.b', { value: 1 })).toBe(emptyStringObj);
    expect(emptyStringObj).toEqual({ a: '' });

    const nullObj = { a: null };
    expect(toSet(nullObj, 'a.b', { value: 1 })).toBe(nullObj);
    expect(nullObj).toEqual({ a: null });
  });
});
