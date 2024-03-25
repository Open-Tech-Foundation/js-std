import { pick } from '../../src';

describe('Object > pick', () => {
  test('invalid', () => {
    expect(pick()).toEqual({});
    expect(pick(null)).toEqual({});
    expect(pick(null, '')).toEqual({});
    expect(pick({})).toEqual({});
    expect(pick({}, 'a')).toEqual({});
    expect(pick({ a: 1 }, 'b')).toEqual({});
    expect(pick([])).toEqual([]);
    expect(pick([], '0')).toEqual([]);
    expect(pick([1], '1')).toEqual([]);
  });

  test('pick a first level prop', () => {
    expect(pick({ a: 1, b: 2 }, 'a')).toEqual({ a: 1 });
    expect(pick({ a: 1, b: 2 }, 'b')).toEqual({ b: 2 });
    expect(pick({ 'a.b': 1, 'a.c': 2 }, ['a.c'])).toEqual({ 'a.c': 2 });
    expect(pick([1, 2, 3], '0')).toEqual([1]);
    expect(pick([1, 2, 3], 2)).toEqual([3]);
    expect(pick({ '0': 'a', '1': 'b' }, 0)).toEqual({ '0': 'a' });
  });

  test('pick first level multiple props', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, 'a', 'b')).toEqual({ a: 1, b: 2 });
    expect(pick({ a: 1, b: 2, c: 3 }, 'b', 'c')).toEqual({ b: 2, c: 3 });
    expect(pick([1, 2, 3], '0', '2')).toEqual([1, 3]);
    expect(pick([1, 2, 3], '1', 3)).toEqual([2]);
  });

  test('pick second level props', () => {
    expect(pick({ a: { b: 2 } }, 'a.b')).toEqual({ a: { b: 2 } });
    expect(pick({ a: { b: 2, c: 3 } }, 'a.c')).toEqual({ a: { c: 3 } });
    expect(
      pick({ a: { b: { c: 1, d: [1, 2, 3], e: null } } }, 'a.b.d[2]', [
        'a',
        'b',
        'e',
      ])
    ).toEqual({ a: { b: { d: [3], e: null } } });
    expect(
      pick({ a: { b: { c: 1 }, d: null, e: [10, 20, 30] } }, 'a.b', [
        'a',
        'e',
        '2',
      ])
    ).toEqual({ a: { b: { c: 1 }, e: [30] } });
  });

  test('pick deep level props', () => {
    expect(pick({ a: { b: { c: 1 } } }, 'a')).toEqual({
      a: { b: { c: 1 } },
    });

    expect(pick({ a: { b: { c: 1 }, d: null } }, 'a.b')).toEqual({
      a: { b: { c: 1 } },
    });

    expect(pick({ a: { b: { c: 1 } } }, 'a.b.c')).toEqual({
      a: { b: { c: 1 } },
    });

    expect(
      pick(
        { a: { b: { c: 1, d: 3 } }, a2: { a2b1: 5, a2b2: 6 } },
        'a.b.c',
        ['a', 'b', 'd'],
        'a2.a2b2',
        ['a2', 'a2b1']
      )
    ).toEqual({
      a: { b: { c: 1, d: 3 } },
      a2: { a2b1: 5, a2b2: 6 },
    });
  });

  test('pick whole object with partial paths', () => {
    const obj = { a: { b: { c: 3, d: 4, e: 5 } } };
    expect(pick(obj, 'a', 'a.b.c', ['a', 'b', 'e'])).toEqual(obj);
  });
});
