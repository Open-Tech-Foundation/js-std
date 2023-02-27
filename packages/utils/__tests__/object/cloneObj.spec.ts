import { cloneObj } from '../../src';

describe('Object', () => {
  test('cloneObj', () => {
    expect(cloneObj(undefined)).toBe(undefined);
    expect(cloneObj(null)).toBe(null);
    expect(cloneObj(true)).toBe(true);
    expect(cloneObj(false)).toBe(false);
    expect(cloneObj('')).toBe('');
    expect(cloneObj('abc')).toBe('abc');
    expect(cloneObj(1)).toBe(1);
    expect(cloneObj(1n)).toBe(1n);

    let input: unknown = [];
    let output = cloneObj(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = [1];
    output = cloneObj(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = [1, 'abc', false, null, undefined];
    output = cloneObj(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = [[], [1, 2, 3]];
    output = cloneObj(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = [[[]]];
    output = cloneObj(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = {};
    output = cloneObj(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = { a: undefined, b: null, c: '', d: true, e: 1, f: 5n };
    output = cloneObj(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = { arr: [1, 2, 3], obj: { a: 'abc', b: 123 } };
    output = cloneObj(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = new Date();
    output = cloneObj(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = new Date('2020-05-01');
    output = cloneObj(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = {
      obj1: {},
      obj2: { prop: 1 },
      arr1: [1, null, false, [], {}],
      arr2: [{ prop1: 'abc', prop2: [undefined] }],
      prop1: new Date(),
    };
    output = cloneObj(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);
    expect(output).not.toStrictEqual({ ...(input as object), obj3: {} });
  });
});
