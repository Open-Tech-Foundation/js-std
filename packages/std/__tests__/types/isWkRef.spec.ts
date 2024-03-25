import { isWkRef } from '../../src';

describe('Types > isWkRef', () => {
  test('invalid cases', () => {
    expect(isWkRef()).toBe(false);
    expect(isWkRef(null)).toBe(false);
    expect(isWkRef({})).toBe(false);
  });

  test('valid cases', () => {
    expect(isWkRef(new WeakRef({}))).toBe(true);
  });
});
