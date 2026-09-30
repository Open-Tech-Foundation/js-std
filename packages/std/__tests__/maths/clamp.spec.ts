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

import { clamp } from '../../src';

describe('Maths', () => {
  test('clamp', () => {
    expect(clamp(10, { min: -5, max: 5 })).toBe(5);
    expect(clamp(-10, { min: -5, max: 5 })).toBe(-5);
    expect(clamp(-10, { min: -1, max: -50 })).toBe(-50);
    expect(clamp(0, { min: 1000, max: 1366 })).toBe(1000);
    expect(clamp(1000, { min: 1000, max: 1366 })).toBe(1000);
    expect(clamp(1001, { min: 1000, max: 1366 })).toBe(1001);
    expect(clamp(1500, { min: 1000, max: 1366 })).toBe(1366);
  });
});
