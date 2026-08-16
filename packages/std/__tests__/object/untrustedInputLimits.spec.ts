import { flattenObject, set, toSet, unflattenObject } from '../../src';

describe('Object > limits on untrusted input', () => {
  // A single large numeric segment used to cost eighteen bytes of input and
  // produce an array whose length was a hundred million. The array itself
  // stays sparse and cheap; anything that walks it by length does not, and
  // `JSON.stringify` on the result was a 477 MB string.
  test('a huge numeric segment does not inflate an array length', () => {
    const out = unflattenObject({ 'a[100000000]': 1 }) as Record<
      string,
      unknown
    >;
    const branch = out.a as Record<string, unknown>;

    expect(Array.isArray(branch)).toBe(false);
    expect(branch['100000000']).toBe(1);
    expect(JSON.stringify(out).length).toBeLessThan(100);
  });

  test('the value is kept, only the array-ness is dropped', () => {
    const target: Record<string, unknown> = {};
    set(target, 'a[99999]', 'kept');

    const branch = target.a as Record<string, unknown>;
    expect(Array.isArray(branch)).toBe(false);
    expect(branch['99999']).toBe('kept');
  });

  test('ordinary indices still make arrays', () => {
    expect(unflattenObject({ 'a[0]': 'x', 'a[1]': 'y' })).toEqual({
      a: ['x', 'y'],
    });
    expect(set({}, 'a[3]', 1)).toEqual({ a: [undefined, undefined, undefined, 1] });
    expect(toSet({}, 'a[2]', 1)).toEqual({ a: [undefined, undefined, 1] });
  });

  test('the root array is bounded the same way', () => {
    const out = unflattenObject({ '[100000000]': 1 });

    expect(Array.isArray(out)).toBe(false);
    expect(JSON.stringify(out).length).toBeLessThan(100);
    // A small root index is still an array.
    expect(unflattenObject({ '[0]': 'a', '[1]': 'b' })).toEqual(['a', 'b']);
  });

  test('a flattened array still round-trips, at any size', () => {
    const original = { list: [1, 2, 3], nested: { deep: [4, 5] } };
    expect(unflattenObject(flattenObject(original))).toEqual(original);

    // The limit is checked only when a branch is created, from the first index
    // seen, and a flattened array starts at [0] — so its size does not matter.
    const big = { list: Array.from({ length: 50_000 }, (_, i) => i) };
    const back = unflattenObject(flattenObject(big)) as { list: number[] };
    expect(Array.isArray(back.list)).toBe(true);
    expect(back.list).toHaveLength(50_000);
  });
});
