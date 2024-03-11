import { isPureObj } from '../../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fun(x?: any) {
  return x;
}

describe('Types > isPureObj', () => {
  test('Invalid cases', () => {
    expect(isPureObj(undefined)).toBe(false);
    expect(isPureObj(null)).toBe(false);
    expect(isPureObj(true)).toBe(false);
    expect(isPureObj(false)).toBe(false);
    expect(isPureObj(0)).toBe(false);
    expect(isPureObj(1n)).toBe(false);
    expect(isPureObj('')).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isPureObj(() => {})).toBe(false);
    expect(isPureObj(Symbol)).toBe(false);
    expect(isPureObj(Symbol('Sym'))).toBe(false);
    expect(isPureObj(Math.min)).toBe(false);
    expect(isPureObj(fun)).toBe(false);
    expect(isPureObj(fun())).toBe(false);
    expect(isPureObj(Map)).toBe(false);
    expect(isPureObj(Set)).toBe(false);
    expect(isPureObj(Error)).toBe(false);
  });

  test('valid cases', () => {
    expect(isPureObj(/./)).toBe(true);
    expect(isPureObj(new Map())).toBe(true);
    expect(isPureObj(new Set())).toBe(true);
    expect(isPureObj(Math)).toBe(true);
    expect(isPureObj(new Error())).toBe(true);
    expect(isPureObj([])).toBe(true);
    expect(isPureObj({})).toBe(true);
    expect(isPureObj({ a: 1 })).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isPureObj(new (fun as any)(1))).toBe(true);
    expect(isPureObj(new Object())).toBe(true);
    expect(isPureObj(Object.create(null))).toBe(true);
  });
});
