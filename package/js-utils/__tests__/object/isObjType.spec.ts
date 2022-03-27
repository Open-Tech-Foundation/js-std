import { isObjType } from '../../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fun(x?: any) {
  return x;
}

describe('Object', () => {
  test('isObjType', () => {
    expect(isObjType(undefined)).toBeFalsy();
    expect(isObjType(null)).toBeFalsy();
    expect(isObjType(true)).toBeFalsy();
    expect(isObjType(false)).toBeFalsy();
    expect(isObjType(0)).toBeFalsy();
    expect(isObjType(1n)).toBeFalsy();
    expect(isObjType('')).toBeFalsy();
    expect(isObjType([])).toBeFalsy();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isObjType(() => {})).toBeFalsy();
    expect(isObjType(Symbol)).toBeFalsy();
    expect(isObjType(Symbol('Sym'))).toBeFalsy();
    expect(isObjType(Math)).toBeFalsy();
    expect(isObjType(Math.min)).toBeFalsy();
    expect(isObjType(Error)).toBeFalsy();
    expect(isObjType(new Error())).toBeFalsy();
    expect(isObjType(fun)).toBeFalsy();
    expect(isObjType(fun())).toBeFalsy();
    expect(isObjType(Map)).toBeFalsy();
    expect(isObjType(new Map())).toBeFalsy();
    expect(isObjType(Set)).toBeFalsy();
    expect(isObjType(new Set())).toBeFalsy();
    expect(isObjType(/./)).toBeFalsy();

    expect(isObjType({})).toBeTruthy();
    expect(isObjType({ a: 1 })).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isObjType(new (fun as any)(1))).toBeTruthy();
    expect(isObjType(new Object())).toBeTruthy();
    expect(isObjType(Object.create(null))).toBeTruthy();
  });
});
