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

import { replaceAt } from '../../src';

describe('Array', () => {
  test('replaceAt', () => {
    expect(replaceAt([1, 2, 3], 1, { items: [5] })).toEqual([1, 5, 3]);
    expect(replaceAt([1, 2, 3], 1, { items: [5, 6] })).toEqual([1, 5, 6, 3]);
    expect(replaceAt([1, 2, 3], 0, { items: [0] })).toEqual([0, 2, 3]);
    expect(replaceAt([1, 2, 3], 2, { items: [4] })).toEqual([1, 2, 4]);
    expect(replaceAt([], 0, { items: [1] })).toEqual([1]);
    expect(replaceAt()).toEqual([]);
  });
});
