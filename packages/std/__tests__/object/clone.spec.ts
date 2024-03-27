import { clone } from '../../src';

// const clone = structuredClone

// import { cloneDeep as clone } from 'lodash';

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
    expect(output).toEqual([1, , 3, 4, 5]);
    expect(output.length).toBe(5);
    const values = Object.values(output);
    expect(values).toEqual([1, 3, 4, 5]);
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

    const CIRCULAR = {
      deeply: {
        nested: {
          reference: {},
        },
      },
      other: {
        reference: {},
      },
    };

    CIRCULAR.deeply.nested.reference = CIRCULAR;
    CIRCULAR.other.reference = CIRCULAR;
    const result = clone(CIRCULAR);
    expect(result).not.toBe(CIRCULAR);
    expect(result).toEqual(CIRCULAR);
  });

  test('ArrayBuffer', () => {
    let buffer = new ArrayBuffer(8);
    const view = new Int32Array(buffer);
    view[1] = 42;
    let output = clone(buffer);

    expect(output).not.toBe(buffer);
    expect(output).toEqual(buffer);
    expect(new Int32Array(output)[1]).toBe(42);

    buffer = new ArrayBuffer(8, { maxByteLength: 16 });
    output = clone(buffer);
    expect(output).not.toBe(buffer);
    expect(output).toEqual(buffer);
    expect(buffer.byteLength).toBe(8);
    expect(buffer.maxByteLength).toBe(16);
  });

  test('TypedArray', () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint32Array(buffer);
    view[0] = 1;
    view[1] = 5;
    let output = clone(view);

    expect(output.buffer).not.toBe(buffer);
    expect(output).not.toBe(view);
    expect(output.buffer).toEqual(buffer);
    expect(output).toEqual(view);
    expect(output[1]).toBe(5);

    const buf2 = new ArrayBuffer(16);
    const v2 = new Uint8Array(buf2, 8);
    v2[0] = 3;
    output = clone(v2);
    expect(output.buffer).not.toBe(buf2);
    expect(output).not.toBe(v2);
    expect(output).toEqual(v2);
    // expect(output.buffer).toEqual(v2.buffer);
    expect(output[0]).toBe(3);

    const buff3 = new ArrayBuffer(16);
    const v3 = new Int16Array(buff3, 4, 2);
    v3[0] = 8;
    v3[1] = 9;
    output = clone(v3);
    expect(output.buffer).not.toBe(buff3);
    expect(output.buffer).toEqual(buff3);
    expect(output).not.toBe(v3);
    expect(output).toEqual(v3);
    expect(output[0]).toBe(8);
    expect(output[1]).toBe(9);
  });

  test('DataView', () => {
    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer, 0);

    view.setInt16(1, 42);
    const output = clone(view);
    expect(output.buffer).not.toBe(buffer);
    expect(output.buffer).toEqual(buffer);
    expect(output).not.toBe(view);
    expect(output).toEqual(view);
    expect(output.getInt16(1)).toBe(42);
  });

  test('Errors', () => {
    let error = new RangeError('Out of bounds!');
    let output = clone(error);
    expect(output).not.toBe(error);
    expect(output).toEqual(error);
    expect(output.name).toBe(error.name);
    expect(output.message).toBe(error.message);
    expect(output.stack).toBe(error.stack);
    expect(output).toBeInstanceOf(RangeError);

    error = new Error('Whoops!', { cause: 'Cloning' });
    output = clone(error);
    expect(output).not.toBe(error);
    expect(output).toEqual(error);
    expect(output.name).toBe(error.name);
    expect(output.message).toBe(error.message);
    expect(output.stack).toBe(error.stack);
    expect(output.cause).toBe(error.cause);
    expect(output).toBeInstanceOf(Error);
  });

  test('functions', () => {
    const fn = (a, b) => a + b;
    const obj = { sum: fn };
    const output = clone(obj);
    expect(output).not.toBe(obj);
    expect(output).toEqual(obj);
    expect(output.sum).toBe(obj.sum);
  });

  test('regexp', () => {
    let regex = new RegExp('foo', 'g');
    let output = clone(regex);
    expect(output).not.toBe(regex);
    expect(output).toEqual(regex);
    expect(output.global).toBe(true);
    expect(output.ignoreCase).toBe(false);

    regex = /ab+c/gi;
    output = clone(regex);
    expect(output).not.toBe(regex);
    expect(output).toEqual(regex);
    expect(output.global).toBe(true);
    expect(output.ignoreCase).toBe(true);
  });
});
