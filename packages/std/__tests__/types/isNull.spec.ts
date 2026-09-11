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

import { isNull } from '../../src';

describe('Types > isNull', () => {
  test('invalid cases', () => {
    expect(isNull(undefined)).toBe(false);
    expect(isNull('')).toBe(false);
    expect(isNull(0)).toBe(false);
    expect(isNull(false)).toBe(false);
  });

  test('valid cases', () => {
    expect(isNull(null)).toBe(true);
  });
});
