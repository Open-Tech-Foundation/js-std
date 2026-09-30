import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import { isEqual } from '../../src';

class A {
  constructor() {
    this.a = 1;
  }
}

describe('Assert => isEqual', () => {
  test('truthy', () => {
    expect(isEqual()).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(Number.NaN, Number.NaN)).toBe(true);
    expect(isEqual(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).toBe(
      true,
    );
    expect(isEqual(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)).toBe(
      true,
    );
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual(1.5, 1.5)).toBe(true);
    expect(isEqual(5n, 5n)).toBe(true);
    expect(isEqual('', '')).toBe(true);
    expect(isEqual('abc', 'abc')).toBe(true);
    expect(isEqual([], [])).toBe(true);
    expect(isEqual([undefined], [undefined])).toBe(true);
    expect(isEqual([1, undefined, 2], [1, undefined, 2])).toBe(true);
    expect(isEqual([1], [1])).toBe(true);
    expect(isEqual([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])).toBe(true);
    expect(isEqual([1, '2', 3.5, 4n, true], [1, '2', 3.5, 4n, true])).toBe(
      true,
    );
    expect(isEqual({}, {})).toBe(true);
    expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    expect(isEqual(new Date('2000-01-01'), new Date('2000-01-01'))).toBe(true);
    expect(isEqual(new Date(''), new Date(''))).toBe(true);

    const map1 = new Map([
      ['1', 1],
      ['2', 2],
      ['3', 3],
    ]);
    const map2 = new Map([
      ['1', 1],
      ['2', 2],
      ['3', 3],
    ]);
    expect(isEqual(map1, map2)).toBe(true);

    const objectKeyMap1 = new Map([
      [{ a: 1 }, { b: 2 }],
      [{ c: 3 }, { d: 4 }],
    ]);
    const objectKeyMap2 = new Map([
      [{ a: 1 }, { b: 2 }],
      [{ c: 3 }, { d: 4 }],
    ]);
    expect(isEqual(objectKeyMap1, objectKeyMap2)).toBe(true);

    const mySet1 = new Set([1, 2, 3, 4]);
    const mySet2 = new Set([1, 2, 3, 4]);
    expect(isEqual(mySet1, mySet2)).toBe(true);

    function fn() {}
    expect(isEqual({ a: fn }, { a: fn })).toBe(true);

    if (globalThis.structuredClone) {
      const o1 = {
        field: 'status',
        fieldtype: 'jira',
        fieldId: 'status',
        from: '10000',
        fromString: 'To Do',
        to: '3',
        toString: 'In Progress',
      };
      const o2 = structuredClone(o1);
      expect(isEqual(o1, o2)).toBe(true);
    }

    expect(isEqual(new Int16Array([1, 2]), new Int16Array([1, 2]))).toBe(true);

    expect(
      isEqual(new Set().add({ foo: 'bar' }), new Set().add({ foo: 'bar' })),
    ).toBe(true);

    const sym = Symbol('foo');
    const symObj = { [sym]: 'foo' };
    expect(isEqual(symObj, { [sym]: 'foo' })).toBe(true);
    expect(isEqual({}, { [sym]: 'foo' })).toBe(false);

    const e = new Error('Test msg.');
    const e2 = new Error('Test msg.');
    expect(isEqual(e, e2)).toBe(true);

    expect(isEqual([[]], [[]])).toBe(true);
  });

  test('different string keys with undefined values are not equal', () => {
    expect(isEqual({ a: undefined }, { b: undefined })).toBe(false);
  });

  test('different symbol keys with undefined values are not equal', () => {
    const symA = Symbol('a');
    const symB = Symbol('b');
    expect(isEqual({ [symA]: undefined }, { [symB]: undefined })).toBe(false);
  });

  test('falsy', () => {
    expect(isEqual(undefined, null)).toBe(false);
    expect(isEqual([1], [2])).toBe(false);
    expect(isEqual([1, 2, 3], [1, 3, 2])).toBe(false);
    expect(isEqual([1, 2, 3], [1, 2, 3, 4])).toBe(false);
    expect(isEqual(new Date('2000-01-01'), new Date('2000-01-02'))).toBe(false);
    const map1 = new Map([
      ['1', 1],
      ['2', 2],
      ['3', 3],
    ]);
    const map2 = new Map([
      ['1', 1],
      ['2', 5],
      ['3', 3],
    ]);
    expect(isEqual(map1, map2)).toBe(false);

    const mySet1 = new Set([1, 2, 3, 4]);
    const mySet2 = new Set([1, 2, 3, 4, 5]);
    expect(isEqual(mySet1, mySet2)).toBe(false);

    const mapA = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const mapB = new Map([
      ['b', 2],
      ['a', 1],
    ]);
    expect(isEqual(mapA, mapB)).toBe(false);

    const objectKeyMap1 = new Map([[{ a: 1 }, { b: 2 }]]);
    const objectKeyMap2 = new Map([[{ a: 1 }, { b: 3 }]]);
    expect(isEqual(objectKeyMap1, objectKeyMap2)).toBe(false);

    expect(isEqual(new Set([1, [2, 3]]), new Set([1, [3, 2]]))).toBe(false);

    expect(isEqual({ a: 1 }, null)).toBe(false);

    const symbol1 = Symbol();
    const symbol2 = Symbol();
    expect(isEqual({ [symbol1]: 1 }, { [symbol2]: 1 })).toBe(false);

    const re = /ab+c/;
    const re2 = /ab+d/;
    expect(isEqual(re, re2)).toBe(false);

    expect(isEqual([1, undefined, 2], [1, , 2])).toBe(false);

    const first = new A();
    const second = { a: 1 };
    expect(isEqual(first, second)).toBe(false);
  });

  test('Deep objs with all supported types in it', () => {
    if (globalThis.structuredClone) {
      const o1 = {
        a: undefined,
        b: null,
        c: 0,
        d: -0,
        e: 1,
        f: 1n,
        g: 'a',
        h: [1, 2, 3],
        i: {
          j: true,
          k: false,
          l: new Date(),
          l2: [new Uint8Array(10), new Float32Array(32)],
        },
        m: new Map([
          ['1', 1],
          ['2', 2],
        ]),
        n: new Set([1, 2, 3, 4, 5]),
      };
      const o2 = structuredClone(o1);
      expect(isEqual(o1, o2)).toBe(true);
    }
  });

  test('cyclic refs', () => {
    const obj1 = { a: 1, b: 3 };
    obj1.self = obj1;

    const obj2 = { a: 1, b: 3 };
    obj2.self = obj2;
    expect(isEqual(obj1, obj2)).toBe(true);
  });

  test('TypedArray', () => {
    const ta1 = new Uint8Array([42, 43]);
    const ta2 = new Uint8Array([42, 43]);
    const ta3 = new Uint8Array([42, 45]);
    expect(isEqual(ta1, ta2)).toBe(true);
    expect(isEqual(ta2, ta3)).toBe(false);

    const obj1 = { ta: new Uint8Array(10) };
    const obj2 = { ta: new Uint8Array(100) };
    expect(isEqual(obj1, obj2)).toBe(false);

    const buffer = new ArrayBuffer(8);
    const buffer2 = new ArrayBuffer(8);
    const ta132 = new Uint32Array(buffer);
    ta132[0] = 100;
    const ta232 = new Uint32Array(buffer2, 4);
    ta232[0] = 100;
    expect(isEqual(ta132, ta232)).toBe(false);
  });

  test('ArrayBuffer', () => {
    const buffer = new ArrayBuffer(8);
    const buffer2 = new ArrayBuffer(8);
    const buffer3 = new ArrayBuffer(8);
    const ta1 = new Uint8Array(buffer);
    ta1[0] = 100;
    const ta2 = new Uint8Array(buffer2);
    ta2[0] = 100;
    const ta3 = new Uint32Array(buffer3);
    ta3[0] = 1000;
    expect(isEqual(buffer, buffer2)).toBe(true);
    expect(isEqual(buffer2, buffer3)).toBe(false);
  });

  test('DataView', () => {
    const buf1 = new ArrayBuffer(8);
    const buf2 = new ArrayBuffer(8);
    const v1 = new DataView(buf1);
    const v2 = new DataView(buf2);
    v1.setInt8(0, 3);
    v2.setInt8(0, 3);
    expect(isEqual(v1, v2)).toBe(true);
    v1.setInt8(1, 5);
    v2.setInt8(1, 6);
    expect(isEqual(v1, v2)).toBe(false);
    v2.setInt8(1, 5);
    expect(isEqual(v1, v2)).toBe(true);
  });

  test('Error advanced', () => {
    const e1 = new Error('msg', { cause: 'foo' });
    const e2 = new Error('msg', { cause: 'foo' });
    const e3 = new Error('msg', { cause: 'bar' });
    expect(isEqual(e1, e2)).toBe(true);
    expect(isEqual(e1, e3)).toBe(false);

    const custom1 = new Error('msg') as any;
    custom1.code = 404;
    const custom2 = new Error('msg') as any;
    custom2.code = 404;
    const custom3 = new Error('msg') as any;
    custom3.code = 500;
    expect(isEqual(custom1, custom2)).toBe(true);
    expect(isEqual(custom1, custom3)).toBe(false);

    const sym = Symbol('meta');
    const symError1 = new Error('msg') as Error &
      Record<string | symbol, unknown>;
    const symError2 = new Error('msg') as Error &
      Record<string | symbol, unknown>;
    const symError3 = new Error('msg') as Error &
      Record<string | symbol, unknown>;
    symError1[sym] = { id: 1 };
    symError2[sym] = { id: 1 };
    symError3[sym] = { id: 2 };
    expect(isEqual(symError1, symError2)).toBe(true);
    expect(isEqual(symError1, symError3)).toBe(false);
  });

  test('shallow comparison includes symbol keys', () => {
    const sym = Symbol('foo');

    expect(isEqual({ [sym]: 1 }, { [sym]: 1 }, { shallow: true })).toBe(true);
    expect(isEqual({ [sym]: 1 }, { [sym]: 2 }, { shallow: true })).toBe(false);
    expect(isEqual({ [sym]: 1 }, {}, { shallow: true })).toBe(false);
  });
});
