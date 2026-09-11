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

import { clone, deepFreeze, isEql, merge, mergeAll } from '../../src';

/** Wraps a leaf in `levels` plain objects, keyed by a string. */
function stringChain(levels: number): Record<string, unknown> {
  let obj: Record<string, unknown> = { end: true };

  for (let i = 0; i < levels; i++) {
    obj = { k: obj };
  }

  return obj;
}

/** The same chain, but every link is reached through a symbol key. */
function symbolChain(levels: number): Record<string, unknown> {
  let obj: Record<string | symbol, unknown> = { end: true };

  for (let i = 0; i < levels; i++) {
    obj = { [Symbol('link')]: obj };
  }

  return obj as Record<string, unknown>;
}

/** Alternates string and symbol links, so neither counter can be skipped. */
function mixedChain(levels: number): Record<string, unknown> {
  let obj: Record<string | symbol, unknown> = { end: true };

  for (let i = 0; i < levels; i++) {
    obj = i % 2 === 0 ? { k: obj } : { [Symbol('link')]: obj };
  }

  return obj as Record<string, unknown>;
}

describe('Object > the recursion depth cap', () => {
  describe('clone', () => {
    test('walks an ordinary structure without complaint', () => {
      expect(clone(stringChain(511))).toEqual(stringChain(511));
    });

    test('refuses a string-keyed chain past the cap', () => {
      expect(() => clone(stringChain(512))).toThrow(RangeError);
      expect(() => clone(stringChain(512))).toThrow(
        'clone: input nested deeper than 512 levels.',
      );
    });

    // The symbol branch passed `objRefMap` on without `depth + 1`, so the
    // counter restarted at zero on every link and the cap never arrived. A
    // symbol-keyed chain of any depth cloned happily while the string-keyed
    // equivalent stopped at 512.
    test('counts symbol keys toward the cap, exactly as string keys', () => {
      expect(() => clone(symbolChain(511))).not.toThrow();
      expect(() => clone(symbolChain(512))).toThrow(RangeError);
      expect(() => clone(symbolChain(512))).toThrow(
        'clone: input nested deeper than 512 levels.',
      );
    });

    test('a symbol-keyed chain far past the cap is refused, not walked', () => {
      expect(() => clone(symbolChain(5000))).toThrow(RangeError);
    });

    test('counts a chain that alternates string and symbol links', () => {
      expect(() => clone(mixedChain(511))).not.toThrow();
      expect(() => clone(mixedChain(512))).toThrow(RangeError);
    });

    // Errors carry their own symbol loop, which had the same omission.
    // Assert on the clone itself: the shallow case must preserve the payload
    // rather than only avoiding an error.
    test('counts symbol properties hung off an Error', () => {
      const key = Symbol('payload');
      const shallow = new Error('boom') as Error & Record<symbol, unknown>;
      shallow[key] = stringChain(4);

      const copy = clone(shallow) as Error & Record<symbol, unknown>;
      expect(copy.message).toBe('boom');
      expect(copy[key]).toEqual(stringChain(4));

      const deep = new Error('boom') as Error & Record<symbol, unknown>;
      deep[key] = symbolChain(5000);
      expect(() => clone(deep)).toThrow(RangeError);
    });

    test('still clones a symbol-keyed value correctly', () => {
      const key = Symbol('k');
      const source = { [key]: { nested: [1, 2] } };
      const copy = clone(source);

      expect(copy[key]).toEqual({ nested: [1, 2] });
      expect(copy[key]).not.toBe(source[key]);
    });
  });

  describe('the other deep walkers', () => {
    test('isEql refuses a chain past the cap', () => {
      expect(isEql(stringChain(511), stringChain(511))).toBe(true);
      expect(() => isEql(stringChain(512), stringChain(512))).toThrow(
        RangeError,
      );
      expect(() => isEql(stringChain(512), stringChain(512))).toThrow(
        'isEql: input nested deeper than 512 levels.',
      );
    });

    test('deepFreeze refuses a chain past the cap', () => {
      expect(() => deepFreeze(stringChain(511))).not.toThrow();
      expect(() => deepFreeze(stringChain(512))).toThrow(RangeError);
      expect(() => deepFreeze(stringChain(512))).toThrow(
        'deepFreeze: input nested deeper than 512 levels.',
      );
    });

    test('merge refuses a chain past the cap', () => {
      expect(() => merge(stringChain(512), stringChain(512))).not.toThrow();
      expect(() => merge(stringChain(513), stringChain(513))).toThrow(
        RangeError,
      );
    });

    test('mergeAll refuses a chain past the cap', () => {
      expect(() =>
        mergeAll([stringChain(511), stringChain(511)]),
      ).not.toThrow();
      expect(() => mergeAll([stringChain(512), stringChain(512)])).toThrow(
        RangeError,
      );
    });

    test('the message always names a function and the limit', () => {
      for (const run of [
        () => clone(stringChain(600)),
        () => isEql(stringChain(600), stringChain(600)),
        () => deepFreeze(stringChain(600)),
        () => merge(stringChain(600), stringChain(600)),
        () => mergeAll([stringChain(600), stringChain(600)]),
      ]) {
        expect(run).toThrow(/^\w+: input nested deeper than 512 levels\.$/);
      }
    });
  });
});
