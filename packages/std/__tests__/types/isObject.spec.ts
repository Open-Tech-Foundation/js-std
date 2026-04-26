import { isObject } from '../../src';

function fun(x?: unknown) {
  return x;
}

describe('Types > isObject', () => {
  test('Invalid cases', () => {
    expect(isObject(undefined)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(false)).toBe(false);
    expect(isObject(0)).toBe(false);
    expect(isObject(1n)).toBe(false);
    expect(isObject('')).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isObject(() => {})).toBe(false);
    expect(isObject(Symbol)).toBe(false);
    expect(isObject(Symbol('Sym'))).toBe(false);
  });

  test('valid cases', () => {
    expect(isObject([])).toBe(true);
    expect(isObject(Math)).toBe(true);
    expect(isObject(Error)).toBe(false); // Error is a function
    expect(isObject(new Error())).toBe(true);
    expect(isObject(new Map())).toBe(true);
    expect(isObject(new Set())).toBe(true);
    expect(isObject(/./)).toBe(true);

    class Person {
      name: string;
      constructor(name: string) {
        this.name = name;
      }
    }
    expect(isObject(new Person('x'))).toBe(true);
    expect(isObject(new (fun as any)(1))).toBe(true);

    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject(new Object())).toBe(true);
    expect(isObject(Object.create(null))).toBe(true);

    if (globalThis.structuredClone) {
      const obj = {
        a: 1,
        b: 'Hello world',
      };
      expect(isObject(structuredClone(obj))).toBe(true);
    }
  });
});
