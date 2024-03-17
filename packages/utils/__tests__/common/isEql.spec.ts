import { isEql } from '../../src';

describe('Object => isEql', () => {
  test('truthy', () => {
    expect(isEql()).toBe(true);
    expect(isEql(undefined, undefined)).toBe(true);
    expect(isEql(null, null)).toBe(true);
    expect(isEql(NaN, NaN)).toBe(true);
    expect(isEql(Infinity, Infinity)).toBe(true);
    expect(isEql(-Infinity, -Infinity)).toBe(true);
    expect(isEql(1, 1)).toBe(true);
    expect(isEql(1.5, 1.5)).toBe(true);
    expect(isEql(5n, 5n)).toBe(true);
    expect(isEql('', '')).toBe(true);
    expect(isEql('abc', 'abc')).toBe(true);
    expect(isEql([], [])).toBe(true);
    expect(isEql([1], [1])).toBe(true);
    expect(isEql([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])).toBe(true);
    expect(isEql([1, '2', 3.5, 4n, true], [1, '2', 3.5, 4n, true])).toBe(true);
    expect(isEql({}, {})).toBe(true);
    expect(isEql({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    expect(isEql(new Date('2000-01-01'), new Date('2000-01-01'))).toBe(true);
    expect(isEql(new Date(''), new Date(''))).toBe(true);

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
    expect(isEql(map1, map2)).toBe(true);

    const mySet1 = new Set([1, 2, 3, 4]);
    const mySet2 = new Set([1, 2, 3, 4]);
    expect(isEql(mySet1, mySet2)).toBe(true);

    function fn() {}
    expect(isEql({ a: fn }, { a: fn })).toBe(true);

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
    expect(isEql(o1, o2)).toBe(true);

    class A {
      constructor() {
        this.a = 1;
      }
    }

    const first = new A();
    const second = { a: 1 };

    expect(isEql(first, second)).toBe(true);

    expect(isEql(new Int16Array([1, 2]), new Int16Array([1, 2]))).toBe(true);

    expect(
      isEql(new Set().add({ foo: 'bar' }), new Set().add({ foo: 'bar' }))
    ).toBe(true);

    const sym = Symbol('foo');
    const symObj = { [sym]: 'foo' };
    expect(isEql(symObj, { [sym]: 'foo' })).toBe(true);

    const e = new Error('Test msg.');
    const e2 = new Error('Test msg.');
    expect(isEql(e, e2)).toBe(true);
  });

  test('falsy', () => {
    expect(isEql(undefined, null)).toBe(false);
    expect(isEql([1], [2])).toBe(false);
    expect(isEql([1, 2, 3], [1, 3, 2])).toBe(false);
    expect(isEql([1, 2, 3], [1, 2, 3, 4])).toBe(false);
    expect(isEql(new Date('2000-01-01'), new Date('2000-01-02'))).toBe(false);
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
    expect(isEql(map1, map2)).toBe(false);

    const mySet1 = new Set([1, 2, 3, 4]);
    const mySet2 = new Set([1, 2, 3, 4, 5]);
    expect(isEql(mySet1, mySet2)).toBe(false);

    const mapA = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const mapB = new Map([
      ['b', 2],
      ['a', 1],
    ]);
    expect(isEql(mapA, mapB)).toBe(false);

    expect(isEql(new Set([1, [2, 3]]), new Set([1, [3, 2]]))).toBe(false);

    expect(isEql({ a: 1 }, null)).toBe(false);

    const symbol1 = Symbol();
    const symbol2 = Symbol();
    expect(isEql({ [symbol1]: 1 }, { [symbol2]: 1 })).toBe(false);

    const re = new RegExp('ab+c');
    const re2 = new RegExp('ab+d');
    expect(isEql(re, re2)).toBe(false);
  });

  test('Deep objs with all supported types in it', () => {
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
    expect(isEql(o1, o2)).toBe(true);
  });

  test('cyclic refs', () => {
    const obj1 = { a: 1, b: 3 };
    obj1.self = obj1;

    const obj2 = { a: 1, b: 3 };
    obj2.self = obj2;
    expect(isEql(obj1, obj2)).toBe(true);
  });
});
