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

import { insertAt } from '../../src';

describe('Array', () => {
  test('insertAt', () => {
    expect(insertAt([1, 2, 3], 1, { items: [5] })).toEqual([1, 5, 2, 3]);
    expect(insertAt([1, 2, 3], 0, { items: [5, 6] })).toEqual([5, 6, 1, 2, 3]);
    expect(insertAt([1, 2, 3], 3, { items: [4] })).toEqual([1, 2, 3, 4]);
    expect(insertAt([], 0, { items: [1] })).toEqual([1]);
    expect(insertAt()).toEqual([]);
  });
});
