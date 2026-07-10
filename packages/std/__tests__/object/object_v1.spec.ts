import { mapKeys, mapValues, omitBy, pickBy } from '../../src';

describe('Object Utilities', () => {
  test('pickBy', () => {
    const obj = { a: 1, b: '2', c: 3 };
    expect(pickBy(obj, (v) => typeof v === 'number')).toEqual({ a: 1, c: 3 });
  });

  test('pickBy includes symbol keys', () => {
    const sym = Symbol('pickBy');
    const obj = { a: 1, [sym]: 2 };
    const out = pickBy(obj, (v) => typeof v === 'number') as Record<
      string | symbol,
      unknown
    >;

    expect(Reflect.ownKeys(out)).toEqual(['a', sym]);
    expect(out[sym]).toBe(2);
  });

  test('omitBy', () => {
    const obj = { a: 1, b: '2', c: 3 };
    expect(omitBy(obj, (v) => typeof v === 'number')).toEqual({ b: '2' });
  });

  test('omitBy includes symbol keys', () => {
    const sym = Symbol('omitBy');
    const obj = { a: 1, [sym]: 2 };
    const out = omitBy(obj, (v) => typeof v === 'string') as Record<
      string | symbol,
      unknown
    >;

    expect(Reflect.ownKeys(out)).toEqual(['a', sym]);
    expect(out[sym]).toBe(2);
  });

  test('mapKeys', () => {
    const obj = { a: 1, b: 2 };
    expect(mapKeys(obj, (v, k) => k + v)).toEqual({ a1: 1, b2: 2 });
  });

  test('mapKeys includes and can remap symbol keys', () => {
    const sym = Symbol('mapKeys');
    const nextSym = Symbol('mapped');
    const obj = { a: 1, [sym]: 2 };
    const out = mapKeys(obj, (v, k) =>
      k === sym ? nextSym : `${String(k)}${v}`,
    ) as Record<string | symbol, unknown>;

    expect(Reflect.ownKeys(out)).toEqual(['a1', nextSym]);
    expect(out[nextSym]).toBe(2);
  });

  test('mapValues', () => {
    const obj = { a: 1, b: 2 };
    expect(mapValues(obj, (v) => v * 2)).toEqual({ a: 2, b: 4 });
  });

  test('mapValues includes symbol keys', () => {
    const sym = Symbol('mapValues');
    const obj = { a: 1, [sym]: 2 };
    const out = mapValues(obj, (v) => v * 2) as Record<
      string | symbol,
      unknown
    >;

    expect(Reflect.ownKeys(out)).toEqual(['a', sym]);
    expect(out[sym]).toBe(4);
  });
});
