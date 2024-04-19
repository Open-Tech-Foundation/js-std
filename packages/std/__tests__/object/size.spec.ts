import { size } from '../../src';

describe('Object => size', () => {
  test('Invalid objs', () => {
    expect(size()).toBe(-1);
    expect(size(undefined)).toBe(-1);
    expect(size(0)).toBe(-1);
    expect(size(1)).toBe(-1);
    expect(size(1.5)).toBe(-1);
    expect(size(1n)).toBe(-1);
    expect(size(false)).toBe(-1);
    expect(size(true)).toBe(-1);
  });

  test('empty objs', () => {
    expect(size('')).toBe(0);
    expect(size([])).toBe(0);
    expect(size({})).toBe(0);
    expect(size(new Map())).toBe(0);
    expect(size(new Set())).toBe(0);
    expect(size(new ArrayBuffer(0))).toBe(0);
    expect(size(new Uint8Array(0))).toBe(0);
  });

  test('Non empty objs', () => {
    expect(size(' ')).toBe(1);
    expect(size('abc')).toBe(3);
    expect(size([1])).toBe(1);
    expect(size({ length: 0, size: 0, byteLength: 0 })).toBe(3);
    expect(size(new Map([[1, 1]]))).toBe(1);
    expect(size(new Set(['a', 'b']))).toBe(2);
    expect(size(new ArrayBuffer(8))).toBe(8);
    expect(size(new Uint8Array(10))).toBe(10);
    expect(size(new Uint8Array(new ArrayBuffer(10), 1, 5))).toBe(5);
    const buffer = new ArrayBuffer(16);
    expect(size(new DataView(buffer))).toBe(16);
    expect(size(new DataView(buffer, 12, 4))).toBe(4);
  });
});
