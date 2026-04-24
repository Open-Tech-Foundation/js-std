import { isWeakRef } from '../../src';

describe('Types > isWeakRef', () => {
  test('invalid cases', () => {
    expect(isWeakRef()).toBe(false);
    expect(isWeakRef(null)).toBe(false);
    expect(isWeakRef({})).toBe(false);
  });

  test('valid cases', () => {
    expect(isWeakRef(new WeakRef({}))).toBe(true);
  });
});
