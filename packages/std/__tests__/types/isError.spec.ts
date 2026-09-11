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

import { isError } from '../../src';

describe('Types > isError', () => {
  test('invalid cases', () => {
    expect(isError()).toBe(false);
    expect(isError({})).toBe(false);
  });

  test('valid cases', () => {
    expect(isError(new Error())).toBe(true);
    expect(isError(new Error('error msg'))).toBe(true);
    expect(isError(Error('error msg'))).toBe(true);
  });
});
