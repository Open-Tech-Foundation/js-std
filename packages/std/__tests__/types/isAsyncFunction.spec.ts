import { isAsyncFunction } from '../../src';

describe('Types > isAsyncFunction', () => {
  test('invalid cases', () => {
    expect(isAsyncFunction()).toBe(false);
    expect(isAsyncFunction({})).toBe(false);
    expect(isAsyncFunction(() => {})).toBe(false);
    expect(isAsyncFunction(() => {})).toBe(false);
    expect(isAsyncFunction(function* () {})).toBe(false);
    expect(isAsyncFunction(async function* () {})).toBe(false);
  });

  test('valid cases', () => {
    expect(isAsyncFunction(async () => {})).toBe(true);
  });
});
