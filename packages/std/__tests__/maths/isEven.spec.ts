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

import { isEven } from '../../src';

describe('Maths', () => {
  test('isEven', () => {
    expect(isEven(0)).toBe(true);
    expect(isEven(1)).toBe(false);
    expect(isEven(2)).toBe(true);
    expect(isEven(-1)).toBe(false);
    expect(isEven(-2)).toBe(true);
  });
});
