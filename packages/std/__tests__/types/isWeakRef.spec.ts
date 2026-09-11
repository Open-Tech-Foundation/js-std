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

import { isWeakRef } from '../../src';

describe('Types > isWeakRef', () => {
  test('invalid cases', () => {
    expect(isWeakRef()).toBe(false);
    expect(isWeakRef(null)).toBe(false);
    expect(isWeakRef({})).toBe(false);
  });

  test('valid cases', () => {
    expect(isWeakRef(new WeakRef({}))).toBe(true);
  });
});
