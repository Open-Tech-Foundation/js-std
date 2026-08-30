import { isEql } from '../../src';

describe('Assert > isEql with circular references', () => {
  // Only plain objects were recorded as the walk descended, so an array, Map
  // or Set that held itself was never recognised as a cycle: the comparison
  // ran until the 512-level depth cap threw a RangeError, rather than
  // answering.
  describe('a container that holds itself', () => {
    test('arrays', () => {
      const a: unknown[] = [];
      a.push(a);
      const b: unknown[] = [];
      b.push(b);

      expect(isEql(a, b)).toBe(true);
    });

    test('sets', () => {
      const a = new Set<unknown>();
      a.add(a);
      const b = new Set<unknown>();
      b.add(b);

      expect(isEql(a, b)).toBe(true);
    });

    test('maps, on both the key and the value side', () => {
      const a = new Map<unknown, unknown>();
      a.set('self', a);
      const b = new Map<unknown, unknown>();
      b.set('self', b);
      expect(isEql(a, b)).toBe(true);

      const c = new Map<unknown, unknown>();
      c.set(c, 'v');
      const d = new Map<unknown, unknown>();
      d.set(d, 'v');
      expect(isEql(c, d)).toBe(true);
    });

    test('plain objects, as before', () => {
      const a: Record<string, unknown> = {};
      a.self = a;
      const b: Record<string, unknown> = {};
      b.self = b;

      expect(isEql(a, b)).toBe(true);
    });

    test('errors', () => {
      const a = new Error('boom') as Error & { self?: unknown };
      a.self = a;
      const b = new Error('boom') as Error & { self?: unknown };
      b.self = b;

      expect(isEql(a, b)).toBe(true);
    });
  });

  describe('longer cycles', () => {
    test('a cycle closed through two objects', () => {
      const a1: Record<string, unknown> = {};
      const a2: Record<string, unknown> = { back: a1 };
      a1.next = a2;

      const b1: Record<string, unknown> = {};
      const b2: Record<string, unknown> = { back: b1 };
      b1.next = b2;

      expect(isEql(a1, b1)).toBe(true);
    });

    test('a cycle closed through an array and an object', () => {
      const a: Record<string, unknown> = {};
      a.list = [a];
      const b: Record<string, unknown> = {};
      b.list = [b];

      expect(isEql(a, b)).toBe(true);
    });

    test('a value reached twice by different paths', () => {
      const shared = { v: 1 };

      expect(
        isEql({ x: shared, y: shared }, { x: { v: 1 }, y: { v: 1 } }),
      ).toBe(true);
    });
  });

  describe('a cycle does not make everything equal', () => {
    test('differing values alongside the cycle are still caught', () => {
      const a: unknown[] = [1];
      a.push(a);
      const b: unknown[] = [2];
      b.push(b);

      expect(isEql(a, b)).toBe(false);
    });

    test('a self-referencing object differs from a non-cyclic one', () => {
      const a: Record<string, unknown> = {};
      a.self = a;

      expect(isEql(a, { self: {} })).toBe(false);
    });

    test('sharing a node is not the same as being equal', () => {
      const shared = { v: 1 };
      const other = { v: 2 };

      // Tracking each side separately called this a cycle as soon as `shared`
      // had been seen once in each graph, whatever it was paired with.
      expect(isEql({ x: shared, y: shared }, { x: other, y: shared })).toBe(
        false,
      );
    });

    test('cycles of different shapes are not equal', () => {
      const a: Record<string, unknown> = {};
      a.next = a;

      const b1: Record<string, unknown> = {};
      const b2: Record<string, unknown> = { next: b1, extra: 1 };
      b1.next = b2;

      expect(isEql(a, b1)).toBe(false);
    });
  });

  test('an ordinary comparison is unaffected', () => {
    expect(isEql({ a: [{ b: 1 }] }, { a: [{ b: 1 }] })).toBe(true);
    expect(isEql({ a: [{ b: 1 }] }, { a: [{ b: 2 }] })).toBe(false);
    expect(isEql(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBe(true);
    expect(isEql(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true);
  });
});
