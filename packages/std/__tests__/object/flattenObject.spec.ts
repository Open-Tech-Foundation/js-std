import { flattenObject, get, unflattenObject } from '../../src';

describe('Object > flattenObject', () => {
  test('flattens nested objects to dotted paths', () => {
    expect(flattenObject({ a: { b: { c: 1 } } })).toEqual({ 'a.b.c': 1 });
  });

  test('leaves an already flat object alone', () => {
    expect(flattenObject({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  test('uses brackets for array indices', () => {
    expect(flattenObject({ a: [1, 2] })).toEqual({ 'a[0]': 1, 'a[1]': 2 });
  });

  test('mixes objects and arrays along one path', () => {
    expect(
      flattenObject({ users: [{ name: 'Tom' }, { name: 'Ram' }] }),
    ).toEqual({
      'users[0].name': 'Tom',
      'users[1].name': 'Ram',
    });
  });

  test('keeps an empty object or array as a value', () => {
    expect(flattenObject({ a: {}, b: [], c: 1 })).toEqual({
      a: {},
      b: [],
      c: 1,
    });
  });

  test('flattens an empty object to an empty object', () => {
    expect(flattenObject({})).toEqual({});
    expect(flattenObject()).toEqual({});
  });

  test('treats non-plain objects as values', () => {
    const date = new Date(0);
    const map = new Map([['a', 1]]);
    const re = /x/;

    expect(flattenObject({ date, map, re })).toEqual({ date, map, re });
  });

  test('treats a class instance as a value', () => {
    class Point {
      constructor(
        public x: number,
        public y: number,
      ) {}
    }
    const p = new Point(1, 2);

    expect(flattenObject({ p })).toEqual({ p });
  });

  test('keeps null and undefined leaves', () => {
    expect(flattenObject({ a: { b: null, c: undefined } })).toEqual({
      'a.b': null,
      'a.c': undefined,
    });
  });

  test('produces keys that get can read back', () => {
    const obj = { a: { b: [{ c: 1 }] }, d: 2 };
    const flat = flattenObject(obj);

    expect(Object.keys(flat)).toEqual(['a.b[0].c', 'd']);

    for (const [path, value] of Object.entries(flat)) {
      expect(get(obj, path)).toBe(value);
    }
  });

  test('round-trips through unflattenObject', () => {
    const obj = {
      a: 1,
      b: { c: [1, 2, { d: 'x' }], e: {} },
      f: [],
      g: null,
    };

    expect(unflattenObject(flattenObject(obj))).toEqual(obj);
  });

  test('round-trips an array root', () => {
    const arr = [{ a: 1 }, { a: 2 }];

    expect(flattenObject(arr)).toEqual({ '[0].a': 1, '[1].a': 2 });
    expect(unflattenObject(flattenObject(arr))).toEqual(arr);
  });

  test('cannot tell a dotted key from the path around it', () => {
    // A property of the format: both flatten to the same key. Documented
    // rather than worked around, since the path grammar has no escape.
    expect(flattenObject({ 'a.b': 1 })).toEqual({ 'a.b': 1 });
    expect(flattenObject({ a: { b: 1 } })).toEqual({ 'a.b': 1 });
  });

  test('ignores a non-object input', () => {
    expect(flattenObject(new Date() as unknown as object)).toEqual({});
    expect(flattenObject(null as unknown as object)).toEqual({});
  });
});
