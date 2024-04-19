import { isShallowEql } from '../../src';

describe('Assert => isShallowEql', () => {
  test('not equal', () => {
    expect(isShallowEql(undefined, null)).toBe(false);
    expect(isShallowEql(false, 0)).toBe(false);
    expect(isShallowEql(true, 1)).toBe(false);
    expect(isShallowEql(1, '1')).toBe(false);
    expect(isShallowEql(1, 2)).toBe(false);
    expect(isShallowEql('abc', 'acb')).toBe(false);
    expect(isShallowEql(null, {})).toBe(false);
    expect(isShallowEql({}, null)).toBe(false);
    expect(isShallowEql([1], [1, 2])).toBe(false);
    expect(isShallowEql([], {})).toBe(false);
    expect(isShallowEql([1, { a: 1 }], [1, { a: 1 }])).toBe(false);
    expect(isShallowEql({ a: 1, b: 2, c: [] }, { a: 1, b: 2, c: [] })).toBe(
      false
    );
  });

  test('equal', () => {
    expect(isShallowEql()).toBeTruthy();
    expect(isShallowEql(undefined, undefined)).toBe(true);
    expect(isShallowEql(null, null)).toBe(true);
    expect(isShallowEql(false, false)).toBe(true);
    expect(isShallowEql(true, true)).toBe(true);
    expect(isShallowEql(1, 1)).toBe(true);
    expect(isShallowEql(5.5, 5.5)).toBe(true);
    expect(isShallowEql(NaN, NaN)).toBe(true);
    expect(isShallowEql('abc', 'abc')).toBe(true);
    expect(isShallowEql([], [])).toBe(true);
    expect(isShallowEql({}, {})).toBe(true);
    expect(isShallowEql([1], [1])).toBe(true);
    expect(isShallowEql([1, 2, 3], [1, 2, 3])).toBe(true);
    const b = { x: 0 };
    expect(isShallowEql([1, b], [1, b])).toBe(true);
    expect(isShallowEql({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toBe(true);

    const o = Object.create(null);
    o.a = 1;
    expect(isShallowEql(o, { a: 1 })).toBe(true);

    const obj = {};
    expect(
      isShallowEql(
        { a: 1, b: 'xyz', c: null, d: 8.0, e: obj, f: true },
        { a: 1, b: 'xyz', c: null, d: 8.0, e: obj, f: true }
      )
    ).toBe(true);
  });
});
