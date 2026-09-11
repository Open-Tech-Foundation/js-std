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

import { isGeneratorFunction } from '../../src';

describe('Types > isGeneratorFunction', () => {
  test('invalid cases', () => {
    expect(isGeneratorFunction()).toBe(false);
    expect(isGeneratorFunction({})).toBe(false);
    expect(isGeneratorFunction(() => {})).toBe(false);
    expect(isGeneratorFunction(() => {})).toBe(false);
    expect(isGeneratorFunction(async () => {})).toBe(false);
    expect(isGeneratorFunction(async function* () {})).toBe(false);
  });

  test('valid cases', () => {
    expect(isGeneratorFunction(function* () {})).toBe(true);
  });
});
