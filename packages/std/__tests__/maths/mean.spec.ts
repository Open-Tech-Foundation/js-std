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

import { mean } from '../../src';

describe('Maths', () => {
  test('mean', () => {
    expect(mean()).toBe(Number.NaN);
    expect(mean([])).toBe(Number.NaN);
    expect(mean([1])).toBe(1);
    expect(mean([4, 1, 7])).toBe(4);
    expect(mean([4, 2, 8])).toBeCloseTo(4.67);
    expect(mean([1, , 3] as number[])).toBe(2);
    expect(mean([, ,] as number[])).toBeNaN();
  });
});
