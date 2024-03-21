import { unset } from '../../src';

describe('Object => unset', () => {
  test('Simple', () => {
    const obj = { a: 1, b: 2 };
    expect(unset(obj, 'a')).toEqual({ b: 2 });
    expect(unset(obj, 'b')).toEqual({ a: 1 });
    expect(unset(obj, 'c')).toEqual({ a: 1, b: 2 });
  });

  test('Nested', () => {
    const obj = { a: [{ b: { c: 7 } }] };
    expect(unset(obj, 'a[0].b.c')).toEqual({ a: [{ b: {} }] });
    expect(unset(obj, ['a', '0'])).toEqual({ a: [] });

    const objWithNestedArray = { x: { y: { z: ['a', null, 'b'] } } };
    expect(unset(objWithNestedArray, 'x.y.z')).toEqual({ x: { y: {} } });
    expect(unset(objWithNestedArray, 'x.y.z.0')).toEqual({
      x: { y: { z: [null, 'b'] } },
    });
    expect(unset(objWithNestedArray, 'x.y.z.1')).toEqual({
      x: { y: { z: ['a', 'b'] } },
    });
  });

  test('Array', () => {
    const obj = [1, 2, 3];
    expect(unset(obj, '0')).toEqual([2, 3]);
    expect(unset(obj, '1')).toEqual([1, 3]);
    expect(unset(obj, '3')).toEqual([1, 2, 3]);
  });
});
