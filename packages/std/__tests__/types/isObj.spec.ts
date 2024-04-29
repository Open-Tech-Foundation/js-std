import { isObj } from '../../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fun(x?: any) {
  return x;
}

describe('Types > isObj', () => {
  test('Invalid cases', () => {
    expect(isObj(undefined)).toBe(false);
    expect(isObj(null)).toBe(false);
    expect(isObj(true)).toBe(false);
    expect(isObj(false)).toBe(false);
    expect(isObj(0)).toBe(false);
    expect(isObj(1n)).toBe(false);
    expect(isObj('')).toBe(false);
    expect(isObj([])).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isObj(() => {})).toBe(false);
    expect(isObj(Symbol)).toBe(false);
    expect(isObj(Symbol('Sym'))).toBe(false);
    expect(isObj(Math)).toBe(false);
    expect(isObj(Math.min)).toBe(false);
    expect(isObj(Error)).toBe(false);
    expect(isObj(new Error())).toBe(false);
    expect(isObj(fun)).toBe(false);
    expect(isObj(fun())).toBe(false);
    expect(isObj(Map)).toBe(false);
    expect(isObj(new Map())).toBe(false);
    expect(isObj(Set)).toBe(false);
    expect(isObj(new Set())).toBe(false);
    expect(isObj(/./)).toBe(false);
    // expect(isObj(new Proxy({}, {}))).toBe(false);

    class Person {
      constructor(name) {
        this.name = name;
      }
    }
    expect(isObj(new Person('x'))).toBe(false);
    expect(isObj(new (fun as any)(1))).toBe(false);
  });

  test('valid cases', () => {
    expect(isObj({})).toBe(true);
    expect(isObj({ a: 1 })).toBe(true);
    expect(isObj(new Object())).toBe(true);
    expect(isObj(Object.create(null))).toBe(true);

    if (globalThis.structuredClone) {
      const obj = {
        a: 1,
        b: 'Hello world',
      };
      const clone = structuredClone(obj);
      expect(isObj(structuredClone(obj))).toBe(true);
    }
  });
});
