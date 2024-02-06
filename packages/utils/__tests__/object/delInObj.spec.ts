import { delInObj } from '../../src';

describe('Object => delInObj', () => {
  test('Simple', () => {
    const obj = { a: 1, b: 2 };
    expect(delInObj(obj, 'a')).toBe(true);
    expect(obj.a).toBeUndefined();
    expect(obj.b).toBe(2);
    expect(delInObj(obj, 'b')).toBe(true);
    expect(obj.b).toBeUndefined();
    expect(delInObj(obj, 'c')).toBe(false);
  });

  test('Nested', () => {
    const obj = { a: [{ b: { c: 7 } }] };
    expect(delInObj(obj, 'a[0].b.c')).toBe(true);
    expect(obj).toEqual({ a: [{ b: {} }] });
    expect(delInObj(obj, 'a.0.b.c')).toBe(false);
  });

  test('Array', () => {
    const obj = [1, 2, 3];
    expect(delInObj(obj, '0')).toBe(true);
    expect(obj).toEqual([2, 3]);
    expect(delInObj(obj, '3')).toBe(false);
  });
});
