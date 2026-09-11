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

import { isRegExp } from '../../src';

describe('Types > isRegExp', () => {
  test('invalid cases', () => {
    expect(isRegExp({})).toBe(false);
    expect(isRegExp('/a/')).toBe(false);
  });

  test('valid cases', () => {
    expect(isRegExp(new RegExp())).toBe(true);
    expect(isRegExp(/a/)).toBe(true);
  });
});
