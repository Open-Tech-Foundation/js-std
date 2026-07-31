import { deepFreeze } from '../../src';

describe('Object > deepFreeze', () => {
  test('freezes the object it is given', () => {
    const obj = deepFreeze({ a: 1 });

    expect(Object.isFrozen(obj)).toBe(true);
  });

  test('freezes nested objects, which Object.freeze does not', () => {
    const obj = { db: { host: 'localhost', opts: { pool: 5 } } };

    Object.freeze(obj);
    expect(Object.isFrozen(obj.db)).toBe(false);

    deepFreeze(obj);
    expect(Object.isFrozen(obj.db)).toBe(true);
    expect(Object.isFrozen(obj.db.opts)).toBe(true);
  });

  test('freezes arrays and their elements', () => {
    const arr = deepFreeze([{ a: 1 }, [2]]);

    expect(Object.isFrozen(arr)).toBe(true);
    expect(Object.isFrozen(arr[0])).toBe(true);
    expect(Object.isFrozen(arr[1])).toBe(true);
  });

  test('returns the same object rather than a copy', () => {
    const obj = { a: { b: 1 } };

    expect(deepFreeze(obj)).toBe(obj);
  });

  test('makes writes fail', () => {
    const obj: any = deepFreeze({ a: { b: 1 } });

    // Modules are always strict, so a write to a frozen property throws here
    // rather than being silently dropped.
    expect(() => {
      obj.a.b = 2;
    }).toThrow(TypeError);
    expect(obj.a.b).toBe(1);
  });

  test('follows symbol keys', () => {
    const key = Symbol('nested');
    const obj = deepFreeze({ [key]: { a: 1 } });

    expect(Object.isFrozen(obj[key])).toBe(true);
  });

  test('follows non-enumerable properties', () => {
    const obj = {};
    const hidden = { a: 1 };
    Object.defineProperty(obj, 'hidden', { value: hidden, enumerable: false });

    deepFreeze(obj);

    expect(Object.isFrozen(hidden)).toBe(true);
  });

  test('terminates on a cycle', () => {
    const a: any = { name: 'a' };
    const b: any = { name: 'b', a };
    a.b = b;

    deepFreeze(a);

    expect(Object.isFrozen(a)).toBe(true);
    expect(Object.isFrozen(b)).toBe(true);
  });

  test('terminates on a self-reference', () => {
    const obj: any = {};
    obj.self = obj;

    expect(deepFreeze(obj)).toBe(obj);
    expect(Object.isFrozen(obj)).toBe(true);
  });

  test('freezes the values of a Map and a Set', () => {
    const value = { a: 1 };
    const key = { k: 1 };
    const setItem = { s: 1 };
    const obj = { map: new Map([[key, value]]), set: new Set([setItem]) };

    deepFreeze(obj);

    expect(Object.isFrozen(value)).toBe(true);
    expect(Object.isFrozen(key)).toBe(true);
    expect(Object.isFrozen(setItem)).toBe(true);
  });

  test('cannot stop a Map or Set being mutated, and does not claim to', () => {
    const map = new Map<string, number>();
    deepFreeze(map);

    // Documented: entries live in internal slots that freezing cannot reach.
    map.set('a', 1);

    expect(map.get('a')).toBe(1);
    expect(Object.isFrozen(map)).toBe(true);
  });

  test('does not read accessor properties', () => {
    let reads = 0;
    const obj = {
      get lazy() {
        reads++;
        return { a: 1 };
      },
    };

    deepFreeze(obj);

    expect(reads).toBe(0);
  });

  test('freezes functions it reaches', () => {
    const fn = () => {};
    deepFreeze({ fn });

    expect(Object.isFrozen(fn)).toBe(true);
  });

  test('skips typed arrays instead of throwing on them', () => {
    const bytes = new Uint8Array([1, 2, 3]);

    // Object.freeze alone cannot do this at all.
    expect(() => Object.freeze(bytes)).toThrow(TypeError);

    const obj = deepFreeze({ bytes, meta: { len: 3 } });

    expect(Object.isFrozen(obj)).toBe(true);
    expect(Object.isFrozen(obj.meta)).toBe(true);
    expect(Object.isFrozen(bytes)).toBe(false);
  });

  test('skips a DataView, which freezing would not protect either', () => {
    const view = new DataView(new ArrayBuffer(8));

    deepFreeze({ view });

    // Freezing one does not throw, but nor does it stop a write through it,
    // so it is left alone rather than reported as frozen.
    expect(Object.isFrozen(view)).toBe(false);
  });

  test('passes primitives through untouched', () => {
    expect(deepFreeze(1)).toBe(1);
    expect(deepFreeze('a')).toBe('a');
    expect(deepFreeze(null)).toBe(null);
    expect(deepFreeze(undefined)).toBe(undefined);
  });

  test('freezes a shared object once and reaches both references', () => {
    const shared = { a: 1 };
    const obj = { x: shared, y: shared };

    deepFreeze(obj);

    expect(Object.isFrozen(obj.x)).toBe(true);
    expect(obj.x).toBe(obj.y);
  });
});
