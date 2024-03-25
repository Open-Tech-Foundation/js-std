import { isWkMap } from '../../src';

describe('Types > isWkMap', () => {
  test('invalid cases', () => {
    expect(isWkMap()).toBe(false);
    expect(isWkMap(null)).toBe(false);
    expect(isWkMap(new Map())).toBe(false);
  });

  test('valid cases', () => {
    expect(isWkMap(new WeakMap())).toBe(true);
  });
});
