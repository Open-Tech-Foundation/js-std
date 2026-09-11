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

import { isOdd } from '../../src';

describe('Maths', () => {
  test('isOdd', () => {
    expect(isOdd(0)).toBe(false);
    expect(isOdd(1)).toBe(true);
    expect(isOdd(2)).toBe(false);
    expect(isOdd(-1)).toBe(true);
    expect(isOdd(-2)).toBe(false);
    expect(isOdd(-3)).toBe(true);
    expect(isOdd(-4)).toBe(false);
    expect(isOdd(-5)).toBe(true);
  });
});
