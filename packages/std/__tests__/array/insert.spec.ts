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

import { insert } from '../../src';

describe('Array', () => {
  test('insert', () => {
    expect(insert([1, 2, 3], 1, { items: [5] })).toEqual([1, 5, 2, 3]);
    expect(insert([1, 2, 3], 0, { items: [5, 6] })).toEqual([5, 6, 1, 2, 3]);
    expect(insert([1, 2, 3], 3, { items: [4] })).toEqual([1, 2, 3, 4]);
    expect(insert([], 0, { items: [1] })).toEqual([1]);
    expect(insert()).toEqual([]);

    // Predicate-based insert
    expect(insert([1, 2, 3], (x) => x === 2, { items: [5] })).toEqual([
      1, 5, 2, 3,
    ]);
    expect(
      insert([1, 2, 3], (x) => x === 2, { items: [5], position: 'after' }),
    ).toEqual([1, 2, 5, 3]);
  });

  test('can insert reserved position words as values', () => {
    expect(insert(['a', 'b'], (x) => x === 'b', { items: ['before'] })).toEqual(
      ['a', 'before', 'b'],
    );
    expect(insert(['a', 'b'], (x) => x === 'b', { items: ['after'] })).toEqual([
      'a',
      'after',
      'b',
    ]);
  });
});
