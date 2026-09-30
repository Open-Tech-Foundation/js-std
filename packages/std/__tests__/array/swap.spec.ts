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

import { swap } from '../../src';

describe('Array > swap', () => {
  test('empty array', () => {
    expect(swap([], { x: 0, y: 0 })).toEqual([]);
  });

  test('immutable', () => {
    const arr = [1, 2, 3];
    expect(swap(arr, { x: 1, y: 2 })).toEqual([1, 3, 2]);
    expect(arr).toEqual([1, 2, 3]);
  });

  test('swap 0 index to 1', () => {
    expect(swap([], { x: 0, y: 1 })).toEqual([]);
    expect(swap([0], { x: 0, y: 1 })).toEqual([undefined, 0]);
    expect(swap([0, 1], { x: 0, y: 1 })).toEqual([1, 0]);
  });

  test('swap index > length', () => {
    expect(swap([1, 2, 3], { x: 1, y: 5 })).toEqual([
      1,
      undefined,
      3,
      undefined,
      undefined,
      2,
    ]);
  });

  test('array of objects', () => {
    const arr = [{ a: 1 }, { b: 'a' }, { c: [5] }];
    expect(swap(arr, { x: 0, y: 2 })).toEqual([
      {
        c: [5],
      },
      {
        b: 'a',
      },
      {
        a: 1,
      },
    ]);
  });
});
