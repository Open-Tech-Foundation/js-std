import { clone } from '../../src';

describe('Object', () => {
  test('clone', () => {
    expect(clone(undefined)).toBe(undefined);
    expect(clone(null)).toBe(null);
    expect(clone(true)).toBe(true);
    expect(clone(false)).toBe(false);
    expect(clone('')).toBe('');
    expect(clone('abc')).toBe('abc');
    expect(clone(1)).toBe(1);
    expect(clone(1n)).toBe(1n);

    let input: unknown = [];
    let output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = [1];
    output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = [1, 'abc', false, null, undefined];
    output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = [[], [1, 2, 3]];
    output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = [[[]]];
    output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = {};
    output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = { a: undefined, b: null, c: '', d: true, e: 1, f: 5n };
    output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = { arr: [1, 2, 3], obj: { a: 'abc', b: 123 } };
    output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = new Date();
    output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = new Date('2020-05-01');
    output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);

    input = {
      obj1: {},
      obj2: { prop: 1 },
      arr1: [1, null, false, [], {}],
      arr2: [{ prop1: 'abc', prop2: [undefined] }],
      prop1: new Date(),
    };
    output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);
    expect(output).not.toStrictEqual({ ...(input as object), obj3: {} });
  });
});
