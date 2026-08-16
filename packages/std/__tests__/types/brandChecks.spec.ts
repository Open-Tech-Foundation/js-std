import {
  clone,
  isArrayBuffer,
  isDataView,
  isDate,
  isEql,
  isMap,
  isRegExp,
  isSet,
  isWeakMap,
  isWeakSet,
} from '../../src';

/** An object that claims to be something it is not. */
function tagged(tag: string, extra: object = {}): unknown {
  return { [Symbol.toStringTag]: tag, ...extra };
}

describe('Types > guards cannot be spoofed by Symbol.toStringTag', () => {
  test('a tagged plain object is not the thing it claims to be', () => {
    expect(isMap(tagged('Map'))).toBe(false);
    expect(isSet(tagged('Set'))).toBe(false);
    expect(isWeakMap(tagged('WeakMap'))).toBe(false);
    expect(isWeakSet(tagged('WeakSet'))).toBe(false);
    expect(isDate(tagged('Date', { getTime: () => 0 }))).toBe(false);
    expect(isRegExp(tagged('RegExp', { source: 'a', flags: 'g' }))).toBe(false);
    expect(isArrayBuffer(tagged('ArrayBuffer'))).toBe(false);
    expect(isDataView(tagged('DataView'))).toBe(false);
  });

  test('the real things are still recognised', () => {
    expect(isMap(new Map())).toBe(true);
    expect(isSet(new Set())).toBe(true);
    expect(isWeakMap(new WeakMap())).toBe(true);
    expect(isWeakSet(new WeakSet())).toBe(true);
    expect(isDate(new Date())).toBe(true);
    expect(isRegExp(/a/g)).toBe(true);
    expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true);
    expect(isDataView(new DataView(new ArrayBuffer(8)))).toBe(true);
  });

  // A tagged object used to reach code that trusted the guard and then treated
  // it as iterable.
  test('clone and isEql no longer throw on a tagged object', () => {
    expect(() => clone(tagged('Map', { a: 1 }))).not.toThrow();
    expect(() => clone(tagged('Set', { a: 1 }))).not.toThrow();
    expect(() =>
      isEql(tagged('Map', { a: 1 }), tagged('Map', { a: 1 })),
    ).not.toThrow();

    // and it is cloned as what it actually is, a plain object
    expect(clone(tagged('Map', { a: 1 }))).toMatchObject({ a: 1 });
  });

  test('edge cases', () => {
    expect(isMap(null)).toBe(false);
    expect(isMap(undefined)).toBe(false);
    expect(isSet('not a set')).toBe(false);
    // The prototype answers the getter without being an instance.
    expect(isRegExp(RegExp.prototype)).toBe(false);
    // An invalid date is a Date, but not one anything can use.
    expect(isDate(new Date('nonsense'))).toBe(false);
  });

  test('a real Map still round-trips through clone', () => {
    const map = new Map<string, number>([['a', 1]]);
    const copy = clone(map);

    expect(isMap(copy)).toBe(true);
    expect(copy).not.toBe(map);
    expect([...copy.entries()]).toEqual([['a', 1]]);
  });
});
