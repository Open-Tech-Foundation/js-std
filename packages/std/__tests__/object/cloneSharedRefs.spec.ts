import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import { clone } from '../../src';

/**
 * A value reached twice must come back as one value twice.
 *
 * Plain objects, arrays, Dates, Maps and Sets were recorded as the walk went,
 * so a second reference to one of those resolved to the first clone. Regexps,
 * ArrayBuffers, typed arrays and DataViews were not, so each reference to one
 * produced a fresh copy — `clone({ a: d, b: d })` held one Date but two
 * regexps.
 */
describe('Object > clone preserves shared references', () => {
  test('a regexp reached twice is one regexp', () => {
    const re = /x/g;
    const copy = clone({ a: re, b: re });

    expect(copy.a).toBe(copy.b);
    expect(copy.a).not.toBe(re);
  });

  test('an ArrayBuffer reached twice is one buffer', () => {
    const buffer = new ArrayBuffer(8);
    const copy = clone({ a: buffer, b: buffer });

    expect(copy.a).toBe(copy.b);
    expect(copy.a).not.toBe(buffer);
  });

  test('a typed array reached twice is one array', () => {
    const typed = new Uint8Array([1, 2, 3]);
    const copy = clone({ a: typed, b: typed });

    expect(copy.a).toBe(copy.b);
    expect(copy.a).not.toBe(typed);
  });

  test('a DataView reached twice is one view', () => {
    const view = new DataView(new ArrayBuffer(8));
    const copy = clone({ a: view, b: view });

    expect(copy.a).toBe(copy.b);
    expect(copy.a).not.toBe(view);
  });

  test('the containers that already worked still do', () => {
    const date = new Date(0);
    const arr = [1];
    const map = new Map([['k', 1]]);
    const set = new Set([1]);
    const obj = { v: 1 };
    const copy = clone({
      a: date,
      b: date,
      c: arr,
      d: arr,
      e: map,
      f: map,
      g: set,
      h: set,
      i: obj,
      j: obj,
    });

    expect(copy.a).toBe(copy.b);
    expect(copy.c).toBe(copy.d);
    expect(copy.e).toBe(copy.f);
    expect(copy.g).toBe(copy.h);
    expect(copy.i).toBe(copy.j);
  });

  // This decides more than identity. Two views over one buffer are views of
  // the same memory; cloning the buffer once per view silently broke that,
  // and a write through one clone was invisible to the other.
  describe('views over a shared buffer stay views of one buffer', () => {
    test('a write through one typed array is seen by the other', () => {
      const buffer = new ArrayBuffer(8);
      const copy = clone({
        x: new Uint8Array(buffer),
        y: new Uint8Array(buffer),
      });

      copy.x[0] = 42;

      expect(copy.y[0]).toBe(42);
      expect(copy.x.buffer).toBe(copy.y.buffer);
    });

    test('a DataView and a typed array over one buffer agree', () => {
      const buffer = new ArrayBuffer(8);
      const copy = clone({
        view: new DataView(buffer),
        bytes: new Uint8Array(buffer),
      });

      copy.view.setUint8(0, 7);

      expect(copy.bytes[0]).toBe(7);
    });

    test('views at different offsets keep their relationship', () => {
      const buffer = new ArrayBuffer(8);
      const copy = clone({
        head: new Uint8Array(buffer, 0, 4),
        tail: new Uint8Array(buffer, 4, 4),
      });

      copy.head[0] = 1;
      copy.tail[0] = 2;

      expect(new Uint8Array(copy.head.buffer)[0]).toBe(1);
      expect(new Uint8Array(copy.tail.buffer)[4]).toBe(2);
      expect(copy.head.buffer).toBe(copy.tail.buffer);
    });

    test('the clone is detached from the original buffer', () => {
      const buffer = new ArrayBuffer(4);
      const original = new Uint8Array(buffer);
      const copy = clone({ bytes: original });

      copy.bytes[0] = 9;

      expect(original[0]).toBe(0);
    });
  });

  describe('the values themselves are still cloned correctly', () => {
    test('a regexp keeps its source, flags and lastIndex', () => {
      const re = /ab+c/giy;
      re.lastIndex = 3;
      const copy = clone(re);

      expect(copy).not.toBe(re);
      expect(copy.source).toBe('ab+c');
      expect(copy.flags).toBe(re.flags);
      expect(copy.lastIndex).toBe(3);
    });

    test('a typed array keeps its kind and contents', () => {
      const typed = new Uint16Array([1, 2, 3]);
      const copy = clone(typed);

      expect(copy).toBeInstanceOf(Uint16Array);
      expect(Array.from(copy)).toEqual([1, 2, 3]);
      expect(copy).not.toBe(typed);
    });

    test('a DataView keeps its offset, length and contents', () => {
      const buffer = new ArrayBuffer(8);
      new DataView(buffer).setUint16(2, 513);
      const view = new DataView(buffer, 2, 4);
      const copy = clone(view);

      expect(copy).toBeInstanceOf(DataView);
      expect(copy.byteOffset).toBe(2);
      expect(copy.byteLength).toBe(4);
      expect(copy.getUint16(0)).toBe(513);
    });

    test('an ArrayBuffer keeps its bytes', () => {
      const buffer = new ArrayBuffer(4);
      new Uint8Array(buffer).set([1, 2, 3, 4]);
      const copy = clone(buffer);

      expect(Array.from(new Uint8Array(copy))).toEqual([1, 2, 3, 4]);
      expect(copy).not.toBe(buffer);
    });
  });

  test('a structure that reaches a regexp through a cycle still terminates', () => {
    const node: Record<string, unknown> = { re: /x/ };
    node.self = node;
    const copy = clone(node) as Record<string, unknown>;

    expect(copy.self).toBe(copy);
    expect(copy.re).not.toBe(node.re);
  });
});
