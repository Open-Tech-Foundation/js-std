import { isEmpty } from '../../src';

describe('Object => isEmpty', () => {
  test('truthy', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(new ArrayBuffer(0))).toBe(true);
    const arr = [,];
    expect(isEmpty(arr, true)).toBe(true);
  });

  test('falsy', () => {
    expect(isEmpty()).toBe(false);
    expect(isEmpty(undefined)).toBe(false);
    expect(isEmpty(null)).toBe(false);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty(1.5)).toBe(false);
    expect(isEmpty(1n)).toBe(false);
    expect(isEmpty(false)).toBe(false);
    expect(isEmpty(true)).toBe(false);
    expect(isEmpty(' ')).toBe(false);
    expect(isEmpty('a')).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ length: 0, size: 0, byteLength: 0 })).toBe(false);
    const arr = [,];
    expect(isEmpty(arr)).toBe(false);
  });
});
