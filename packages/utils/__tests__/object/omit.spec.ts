import { omit } from '../../src';

describe('Object > omit', () => {
  test('remove a prop', () => {
    expect(omit({ a: 1, b: 2 }, 'a')).toEqual({ b: 2 });
    expect(omit({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 });
    expect(omit({ 'a.b': 1, b: 2 }, ['a.b'])).toEqual({ b: 2 });
  });

  test('remove multiple props', () => {
    expect(omit({ a: 1, b: 2, c: 3, d: 4 }, 'b', 'd')).toEqual({
      a: 1,
      c: 3,
    });
    expect(omit({ a: 1, b: 2, c: 3, d: 4 }, 'a', 'b', 'c')).toEqual({ d: 4 });
    expect(omit({ 'a.b': 1, b: 2 }, ['a.b'], 'b')).toEqual({});
  });

  test('remove a deep prop', () => {
    expect(omit({ a: { b: { c: 1 } } }, 'a.b.c')).toEqual({ a: { b: {} } });
  });

  test('remove multiple deep props', () => {
    expect(
      omit({ a: { b: { c: 1, d: 2, e: 5, f: 6 } } }, 'a.b.c', 'a.b.d', 'a.b.e')
    ).toEqual({ a: { b: { f: 6 } } });
  });

  test('remove an index from array', () => {
    expect(omit([1, 2, 3], ['0'])).toEqual([2, 3]);
    expect(omit([1, 2, 3], ['1'])).toEqual([1, 3]);
    expect(omit([1, 2, 3], ['2'])).toEqual([1, 2]);
    expect(omit([1, 2, 3], ['3'])).toEqual([1, 2, 3]);
    expect(omit([1, 2, 3], ['-1'])).toEqual([1, 2, 3]);
  });

  test('remove multiple indexes from array', () => {
    expect(omit([1, 2, 3], '1', '2')).toEqual([1]);
  });

  test('remove array items from nested deep obj', () => {
    let obj = { a: [1, 3, 5] };
    expect(omit(obj, 'a.[0]')).toEqual({ a: [3, 5] });

    obj = { a: { b: [1, 3, 5] } };
    expect(omit(obj, 'a.b[2]')).toEqual({ a: { b: [1, 3] } });

    obj = { a: { b: { c: [1, 3, 5] } } };
    expect(omit(obj, 'a.b.c[1]')).toEqual({ a: { b: { c: [1, 5] } } });

    obj = {
      a: {
        b: { c: [1, 3, 5, { d: { e: [10, 20, 40] } }], f: { g: [1, 2, 3] } },
      },
    };
    expect(
      omit(obj, ['a', 'b', 'c', 3], ['a', 'b', 'f', 'g', 0], 'a.b.f.g[2]')
    ).toEqual({
      a: { b: { c: [1, 3, 5], f: { g: [2] } } },
    });
  });
});
