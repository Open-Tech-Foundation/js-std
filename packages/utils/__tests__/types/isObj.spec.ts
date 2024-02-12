import { isObj } from '../../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fun(x?: any) {
  return x;
}

describe('Types', () => {
  test('isObj', () => {
    expect(isObj(undefined)).toBeFalsy();
    expect(isObj(null)).toBeFalsy();
    expect(isObj(true)).toBeFalsy();
    expect(isObj(false)).toBeFalsy();
    expect(isObj(0)).toBeFalsy();
    expect(isObj(1n)).toBeFalsy();
    expect(isObj('')).toBeFalsy();
    expect(isObj([])).toBeFalsy();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isObj(() => {})).toBeFalsy();
    expect(isObj(Symbol)).toBeFalsy();
    expect(isObj(Symbol('Sym'))).toBeFalsy();
    expect(isObj(Math)).toBeFalsy();
    expect(isObj(Math.min)).toBeFalsy();
    expect(isObj(Error)).toBeFalsy();
    expect(isObj(new Error())).toBeFalsy();
    expect(isObj(fun)).toBeFalsy();
    expect(isObj(fun())).toBeFalsy();
    expect(isObj(Map)).toBeFalsy();
    expect(isObj(new Map())).toBeFalsy();
    expect(isObj(Set)).toBeFalsy();
    expect(isObj(new Set())).toBeFalsy();
    expect(isObj(/./)).toBeFalsy();

    expect(isObj({})).toBeTruthy();
    expect(isObj({ a: 1 })).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isObj(new (fun as any)(1))).toBeTruthy();
    expect(isObj(new Object())).toBeTruthy();
    expect(isObj(Object.create(null))).toBeTruthy();
  });
});
