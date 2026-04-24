import { isPlainObject } from '../../src';

function fun(x?: unknown) {
  return x;
}

describe('Types > isPlainObject', () => {
  test('Invalid cases', () => {
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(false)).toBe(false);
    expect(isPlainObject(0)).toBe(false);
    expect(isPlainObject(1n)).toBe(false);
    expect(isPlainObject('')).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isPlainObject(() => {})).toBe(false);
    expect(isPlainObject(Symbol)).toBe(false);
    expect(isPlainObject(Symbol('Sym'))).toBe(false);
    expect(isPlainObject(Math.min)).toBe(false);
    expect(isPlainObject(fun)).toBe(false);
    expect(isPlainObject(fun())).toBe(false);
    expect(isPlainObject(Map)).toBe(false);
    expect(isPlainObject(Set)).toBe(false);
    expect(isPlainObject(Error)).toBe(false);
  });

  test('valid cases', () => {
    expect(isPlainObject(/./)).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
    expect(isPlainObject(new Set())).toBe(false);
    expect(isPlainObject(Math)).toBe(false);
    expect(isPlainObject(new Error())).toBe(false);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    // biome-ignore lint/suspicious/noExplicitAny: Intentional for testing
    expect(isPlainObject(new (fun as any)(1))).toBe(false);
    expect(isPlainObject(new Object())).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });
});
