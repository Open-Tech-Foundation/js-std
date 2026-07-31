import { isArrayLike } from '../../src';

describe('Types > isArrayLike', () => {
  test('accepts arrays', () => {
    expect(isArrayLike([])).toBe(true);
    expect(isArrayLike([1, 2, 3])).toBe(true);
  });

  test('accepts strings', () => {
    expect(isArrayLike('')).toBe(true);
    expect(isArrayLike('abc')).toBe(true);
  });

  test('accepts a plain object carrying a valid length', () => {
    expect(isArrayLike({ length: 0 })).toBe(true);
    expect(isArrayLike({ length: 2, 0: 'a', 1: 'b' })).toBe(true);
  });

  test('accepts typed arrays and arguments objects', () => {
    expect(isArrayLike(new Uint8Array(3))).toBe(true);
    expect(isArrayLike(new Float64Array(0))).toBe(true);

    function collect(..._rest: unknown[]): IArguments {
      // biome-ignore lint/style/noArguments: an arguments object is the subject
      return arguments;
    }

    expect(isArrayLike(collect(1, 2))).toBe(true);
  });

  test('rejects a length that could not index a collection', () => {
    expect(isArrayLike({ length: -1 })).toBe(false);
    expect(isArrayLike({ length: 1.5 })).toBe(false);
    expect(isArrayLike({ length: '2' })).toBe(false);
    expect(isArrayLike({ length: Number.NaN })).toBe(false);
    expect(isArrayLike({ length: Number.POSITIVE_INFINITY })).toBe(false);
    expect(isArrayLike({ length: Number.MAX_SAFE_INTEGER + 2 })).toBe(false);
  });

  test('accepts the largest indexable length', () => {
    expect(isArrayLike({ length: Number.MAX_SAFE_INTEGER })).toBe(true);
  });

  test('rejects objects with no length at all', () => {
    expect(isArrayLike({})).toBe(false);
    expect(isArrayLike(new Map([[1, 2]]))).toBe(false);
    expect(isArrayLike(new Set([1, 2]))).toBe(false);
    expect(isArrayLike(new Date())).toBe(false);
  });

  test('rejects functions, whose length is an arity', () => {
    expect(isArrayLike((a: number, b: number) => a + b)).toBe(false);
    expect(isArrayLike(() => {})).toBe(false);
    // A class has a length too, and is no more a collection for it.
    expect(isArrayLike(class {})).toBe(false);
  });

  test('rejects nullish values and other primitives', () => {
    expect(isArrayLike(null)).toBe(false);
    expect(isArrayLike(undefined)).toBe(false);
    expect(isArrayLike(1)).toBe(false);
    expect(isArrayLike(true)).toBe(false);
    expect(isArrayLike(Symbol('a'))).toBe(false);
  });

  test('agrees with Array.from on what it accepts', () => {
    const arrayLike = { length: 2, 0: 'a', 1: 'b' };

    expect(isArrayLike(arrayLike)).toBe(true);
    expect(Array.from(arrayLike)).toEqual(['a', 'b']);
  });
});
