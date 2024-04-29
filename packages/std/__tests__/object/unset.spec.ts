import { unset } from '../../src';

describe('Object => unset', () => {
  test('non object', () => {
    expect(unset(undefined, 'a')).toBe(undefined);
    expect(unset(null, 'a')).toBe(null);
    expect(unset(1, 'a')).toBe(1);
    expect(unset('test', '0')).toBe('test');
    expect(unset({}, 'a')).toEqual({});
    expect(unset({ a: 2 }, 'b')).toEqual({ a: 2 });
    expect(unset({ a: { b: [1, 2, 3] } }, 'a.b.3')).toEqual({
      a: { b: [1, 2, 3] },
    });
  });

  test('Simple', () => {
    const obj = { a: 1, b: 2 };
    expect(unset(obj, 'a')).toEqual({ b: 2 });
    expect(unset(obj, 'b')).toEqual({});
    expect(unset({ a: 1, b: 2 }, 'c')).toEqual({ a: 1, b: 2 });
  });

  test('Nested', () => {
    const obj = { a: [{ b: { c: 7 } }] };
    expect(unset(obj, 'a[0].b.c')).toEqual({ a: [{ b: {} }] });
    expect(unset(obj, ['a', '0'])).toEqual({ a: [] });

    const objWithNestedArray = { x: { y: { z: ['a', null, 'b'] } } };
    const objWithNestedArray2 = { x: { y: { z: ['a', null, 'b'] } } };
    const objWithNestedArray3 = { x: { y: { z: ['a', null, 'b'] } } };
    expect(unset(objWithNestedArray, 'x.y.z')).toEqual({ x: { y: {} } });
    expect(unset(objWithNestedArray2, 'x.y.z.0')).toEqual({
      x: { y: { z: [, null, 'b'] } },
    });
    expect(unset(objWithNestedArray3, 'x.y.z.1')).toEqual({
      x: { y: { z: ['a', , 'b'] } },
    });
  });

  test('Array', () => {
    const obj = [1, 2, 3];
    expect(unset(obj, '0')).toEqual([, 2, 3]);
    expect(unset(obj, '1')).toEqual([, , 3]);
    expect(unset(obj, '2')).toEqual([, , ,]);
    expect(unset([1, 2, 3], '3')).toEqual([1, 2, 3]);
  });

  test('invalid paths', () => {
    expect(unset({ a: 1 }, 'b')).toEqual({ a: 1 });
    expect(unset({ a: null }, 'a.b')).toEqual({ a: null });
    expect(unset({ a: { b: [1, 2, 3] } }, 'a.c')).toEqual({
      a: { b: [1, 2, 3] },
    });
    expect(unset({ a: { b: [1, 2, 3] } }, 'a.b.c')).toEqual({
      a: { b: [1, 2, 3] },
    });
    expect(unset({ a: { b: [1, 2, 3] } }, 'a.b.3')).toEqual({
      a: { b: [1, 2, 3] },
    });
  });
});
