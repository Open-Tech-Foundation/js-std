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

import { isWeakMap } from '../../src';

describe('Types > isWeakMap', () => {
  test('invalid cases', () => {
    expect(isWeakMap()).toBe(false);
    expect(isWeakMap(null)).toBe(false);
    expect(isWeakMap(new Map())).toBe(false);
  });

  test('valid cases', () => {
    expect(isWeakMap(new WeakMap())).toBe(true);
  });
});
