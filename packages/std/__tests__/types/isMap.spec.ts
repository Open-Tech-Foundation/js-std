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

import { isMap } from '../../src';

describe('Types > isMap', () => {
  test('invalid cases', () => {
    expect(isMap()).toBe(false);
    expect(isMap(null)).toBe(false);
    expect(isMap({})).toBe(false);
    expect(isMap([])).toBe(false);
    expect(isMap(Map)).toBe(false);
    expect(isMap(new WeakMap())).toBe(false);
  });

  test('valid cases', () => {
    expect(isMap(new Map())).toBe(true);
  });
});
