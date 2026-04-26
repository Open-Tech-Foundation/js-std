import { mapKeys, mapValues, omitBy, pickBy } from '../../src';

describe('Object Utilities', () => {
  test('pickBy', () => {
    const obj = { a: 1, b: '2', c: 3 };
    expect(pickBy(obj, (v) => typeof v === 'number')).toEqual({ a: 1, c: 3 });
  });

  test('omitBy', () => {
    const obj = { a: 1, b: '2', c: 3 };
    expect(omitBy(obj, (v) => typeof v === 'number')).toEqual({ b: '2' });
  });

  test('mapKeys', () => {
    const obj = { a: 1, b: 2 };
    expect(mapKeys(obj, (v, k) => k + v)).toEqual({ a1: 1, b2: 2 });
  });

  test('mapValues', () => {
    const obj = { a: 1, b: 2 };
    expect(mapValues(obj, (v) => v * 2)).toEqual({ a: 2, b: 4 });
  });
});
