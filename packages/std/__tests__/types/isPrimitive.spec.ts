import { isPrimitive } from '../../src';

describe('Types > isPrimitive', () => {
  test('accepts every primitive type', () => {
    expect(isPrimitive('a')).toBe(true);
    expect(isPrimitive('')).toBe(true);
    expect(isPrimitive(1)).toBe(true);
    expect(isPrimitive(0)).toBe(true);
    expect(isPrimitive(Number.NaN)).toBe(true);
    expect(isPrimitive(Number.POSITIVE_INFINITY)).toBe(true);
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
    expect(isPrimitive(10n)).toBe(true);
    expect(isPrimitive(Symbol('a'))).toBe(true);
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(undefined)).toBe(true);
  });

  test('rejects objects', () => {
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive(new Map())).toBe(false);
    expect(isPrimitive(new Set())).toBe(false);
    expect(isPrimitive(new Date())).toBe(false);
    expect(isPrimitive(/a/)).toBe(false);
    expect(isPrimitive(Object.create(null))).toBe(false);
  });

  test('rejects functions, which are objects', () => {
    expect(isPrimitive(() => {})).toBe(false);
    expect(isPrimitive(function named() {})).toBe(false);
    expect(isPrimitive(class {})).toBe(false);
    expect(isPrimitive(async () => {})).toBe(false);
  });

  test('rejects a boxed primitive, which is an object', () => {
    expect(isPrimitive(Object('a'))).toBe(false);
    expect(isPrimitive(Object(1))).toBe(false);
    expect(isPrimitive(Object(true))).toBe(false);
  });
});
