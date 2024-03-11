import { clone } from '../../src';

describe('Object > Clone', () => {
  test('Primitives', () => {
    expect(clone(undefined)).toBe(undefined);
    expect(clone(null)).toBe(null);
    expect(clone(true)).toBe(true);
    expect(clone(false)).toBe(false);
    expect(clone('')).toBe('');
    expect(clone('abc')).toBe('abc');
    expect(clone(1)).toBe(1);
    expect(clone(1n)).toBe(1n);
  });

  test('Arrays', () => {
    const input = [1, 'abc', false, null, undefined];
    const output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);
  });

  test('Objects', () => {
    const input = {
      a: [1, 2, 3],
      b: null,
      c: '',
      d: true,
      e: { f: undefined },
    };
    const output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);
  });

  test('Dates', () => {
    const input = new Date();
    const output = clone(input);
    expect(output).not.toBe(input);
    expect(output).toStrictEqual(input);
    expect(input.getTime()).toBe(output.getTime());
  });

  test('Maps', () => {
    const obj = { restock: true };
    const arr = [1, 3, 7];
    const original = new Map([
      [1, 'one'],
      [2, arr],
      [obj, [{ a: 1, b: 'b' }]],
    ]);
    const output = clone(original);
    expect(original).not.toBe(output);
    expect(original.size).toBe(output.size);
    expect(output.get(1)).toBe('one');
    expect(output.get(2)).not.toBe(arr);
    expect(output.get(2)[1]).toBe(3);
    expect(output.get(obj)).toBeUndefined();
    expect(output.get({ restock: true })).toBeUndefined();
  });

  test('Sets', () => {
    const original = new Set();
    original.add(1);
    original.add('some text');
    const o = { a: 1, b: 2 };
    original.add(o);
    const output = clone(original);
    expect(original).not.toBe(output);
    expect(original.size).toBe(output.size);
    expect(output.has(1)).toBe(true);
    expect(output.has(2)).toBe(false);
    expect(output.has('some text')).toBe(true);
    expect(output.has(o)).toBe(false);
  });

  test('sparse array', () => {
    const array1 = [1, 2, 3, 4, 5];
    delete array1[1];
    const output = clone(array1);
    expect(output).toEqual([1, 3, 4, 5]);
    expect(output.length).toBe(4);
  });

  test('keepRef=true', () => {
    const arr = [1, 3, 5];
    const obj = { x: 0, y: 0 };
    const date = new Date();
    const map = new Map();
    const set = new Set();
    const input = {
      a: 1,
      b: arr,
      c: arr,
      d: obj,
      e: { pos: obj },
      f: date,
      g: [1, date],
      h: [map, map],
      i: [set, set],
    };

    const output = clone(input);
    expect(output).toStrictEqual(input);

    output.b.push(8);
    output.d.x += 5;
    output.f.setHours(10);
    output.h[0].set('a', 1000);
    output.i[0].add(2000);

    expect(output.c).toStrictEqual([1, 3, 5, 8]);
    expect(output.e.pos.x).toBe(5);
    expect(output.g[1].getTime()).toBe(output.f.getTime());
    expect(output.h[1].get('a')).toBe(1000);
    expect(output.i[1].has(2000)).toBe(true);
  });

  test('Circular Ref', () => {
    const input = { a: 1 };
    input.self = input;
    const output = clone(input);

    expect(output.self).toBe(output);
  });
});
