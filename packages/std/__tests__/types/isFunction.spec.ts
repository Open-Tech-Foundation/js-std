import { isFunction } from '../../src';

describe('Types > isFunction', () => {
  test('invalid cases', () => {
    expect(isFunction()).toBe(false);
    expect(isFunction({})).toBe(false);
  });

  test('valid cases', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(async () => {})).toBe(true);
    expect(isFunction(function* () {})).toBe(true);
  });
});
