import { toUnset } from '../../src';

describe('Object => toUnset', () => {
  test('non object', () => {
    expect(toUnset(undefined, 'a')).toBe(undefined);
    expect(toUnset(null, 'a')).toBe(null);
    expect(toUnset(1, 'a')).toBe(1);
    expect(toUnset('test', '0')).toBe('test');
    expect(toUnset({}, 'a')).toEqual({});
    expect(toUnset({ a: 2 }, 'b')).toEqual({ a: 2 });
    expect(toUnset({ a: { b: [1, 2, 3] } }, 'a.b.3')).toEqual({
      a: { b: [1, 2, 3] },
    });
  });

  test('Simple', () => {
    const obj = { a: 1, b: 2 };
    expect(toUnset(obj, 'a')).toEqual({ b: 2 });
    expect(toUnset(obj, 'b')).toEqual({ a: 1 });
    expect(toUnset(obj, 'c')).toEqual({ a: 1, b: 2 });
  });

  test('Nested', () => {
    const obj = { a: [{ b: { c: 7 } }] };
    expect(toUnset(obj, 'a[0].b.c')).toEqual({ a: [{ b: {} }] });
    expect(toUnset(obj, ['a', '0'])).toEqual({ a: [] });

    const objWithNestedArray = { x: { y: { z: ['a', null, 'b'] } } };
    expect(toUnset(objWithNestedArray, 'x.y.z')).toEqual({ x: { y: {} } });
    expect(toUnset(objWithNestedArray, 'x.y.z.0')).toEqual({
      x: { y: { z: [null, 'b'] } },
    });
    expect(toUnset(objWithNestedArray, 'x.y.z.1')).toEqual({
      x: { y: { z: ['a', 'b'] } },
    });
  });

  test('Array', () => {
    const obj = [1, 2, 3];
    expect(toUnset(obj, '0')).toEqual([2, 3]);
    expect(toUnset(obj, '1')).toEqual([1, 3]);
    expect(toUnset(obj, '3')).toEqual([1, 2, 3]);
  });

  test('invalid paths', () => {
    expect(toUnset({ a: 1 }, 'b')).toEqual({ a: 1 });
    expect(toUnset({ a: null }, 'a.b')).toEqual({ a: null });
    expect(toUnset({ a: { b: [1, 2, 3] } }, 'a.c')).toEqual({
      a: { b: [1, 2, 3] },
    });
    expect(toUnset({ a: { b: [1, 2, 3] } }, 'a.b.c')).toEqual({
      a: { b: [1, 2, 3] },
    });
    expect(toUnset({ a: { b: [1, 2, 3] } }, 'a.b.3')).toEqual({
      a: { b: [1, 2, 3] },
    });
  });
});
