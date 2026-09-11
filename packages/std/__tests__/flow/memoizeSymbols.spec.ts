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

import { memoizeRun } from '../../src';

/**
 * The symbol identities behind the cache key.
 *
 * These used to live in a module-level `Map` keyed by symbol — strong, shared
 * by every memoized function in the process, and emptied by nothing, so every
 * distinct symbol ever passed as an argument stayed for the life of the
 * process however small the cache was. The record is a `WeakMap` now, and
 * registered symbols do not go into it at all: `Symbol.for('a')` is interned
 * by its key, so the key alone identifies it.
 *
 * The retained memory itself is not observable from a portable test — these
 * specs also run against Node, Deno and the browsers in the runtime matrix,
 * where there is no way to force a collection. What they do guard is the trap
 * in the fix: a `WeakMap` refuses a registered symbol outright, so swapping
 * the `Map` for one without the `Symbol.keyFor` branch turns every
 * `Symbol.for(...)` argument into a `TypeError`, and the registered-symbol
 * cases below fail immediately.
 */
describe('flow > memoizeRun with symbol arguments', () => {
  describe('registered symbols', () => {
    test('the same registry key is the same cache key', async () => {
      const func = mock.fn(async (_s: symbol) => 'v');
      const memoized = memoizeRun(func);

      await memoized(Symbol.for('shared'));
      await memoized(Symbol.for('shared'));

      expect(func).toHaveBeenCalledTimes(1);
    });

    test('different registry keys are different cache keys', async () => {
      const func = mock.fn(async (_s: symbol) => 'v');
      const memoized = memoizeRun(func);

      await memoized(Symbol.for('a'));
      await memoized(Symbol.for('b'));

      expect(func).toHaveBeenCalledTimes(2);
    });

    test('a registered symbol is distinct from a unique one that shares its description', async () => {
      const func = mock.fn(async (_s: symbol) => 'v');
      const memoized = memoizeRun(func);

      await memoized(Symbol.for('x'));
      await memoized(Symbol('x'));

      expect(func).toHaveBeenCalledTimes(2);
    });

    test('a well-known symbol is a stable key', async () => {
      const func = mock.fn(async (_s: symbol) => 'v');
      const memoized = memoizeRun(func);

      await memoized(Symbol.iterator);
      await memoized(Symbol.iterator);
      await memoized(Symbol.asyncIterator);

      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('unique symbols', () => {
    test('the same symbol reused hits the cache', async () => {
      const key = Symbol('once');
      const func = mock.fn(async (_s: symbol) => 'v');
      const memoized = memoizeRun(func);

      await memoized(key);
      await memoized(key);

      expect(func).toHaveBeenCalledTimes(1);
    });

    test('two symbols with the same description are different keys', async () => {
      const func = mock.fn(async (_s: symbol) => 'v');
      const memoized = memoizeRun(func);

      await memoized(Symbol('same'));
      await memoized(Symbol('same'));

      expect(func).toHaveBeenCalledTimes(2);
    });

    test('a symbol with no description is still a key', async () => {
      const key = Symbol();
      const func = mock.fn(async (_s: symbol) => 'v');
      const memoized = memoizeRun(func);

      await memoized(key);
      await memoized(key);
      await memoized(Symbol());

      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('symbol-keyed properties', () => {
    test('a symbol property is part of the key', async () => {
      const key = Symbol('prop');
      const func = mock.fn(async (_o: object) => 'v');
      const memoized = memoizeRun(func);

      await memoized({ [key]: 1 });
      await memoized({ [key]: 1 });
      await memoized({ [key]: 2 });

      expect(func).toHaveBeenCalledTimes(2);
    });

    // The keys are sorted before serialising so the same object always
    // produces the same string, whatever order its symbols were added in.
    test('symbol property order does not change the key', async () => {
      const a = Symbol.for('a');
      const b = Symbol.for('b');
      const func = mock.fn(async (_o: object) => 'v');
      const memoized = memoizeRun(func);

      await memoized({ [a]: 1, [b]: 2 });
      await memoized({ [b]: 2, [a]: 1 });

      expect(func).toHaveBeenCalledTimes(1);
    });

    test('a symbol value and a symbol key are not confused', async () => {
      const key = Symbol.for('k');
      const func = mock.fn(async (_o: object) => 'v');
      const memoized = memoizeRun(func);

      await memoized({ [key]: 1 });
      await memoized({ v: key });

      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  test('registered symbols key alike across separate memoized functions', async () => {
    const first = mock.fn(async (_s: symbol) => 'a');
    const second = mock.fn(async (_s: symbol) => 'b');
    const memoFirst = memoizeRun(first);
    const memoSecond = memoizeRun(second);

    expect(await memoFirst(Symbol.for('shared'))).toBe('a');
    expect(await memoSecond(Symbol.for('shared'))).toBe('b');
    expect(await memoFirst(Symbol.for('shared'))).toBe('a');

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  test('a bounded cache still evicts symbol-keyed entries', async () => {
    const func = mock.fn(async (_s: symbol) => 'v');
    const memoized = memoizeRun(func, { maxSize: 2 });

    await memoized(Symbol.for('a'));
    await memoized(Symbol.for('b'));
    await memoized(Symbol.for('c'));
    await memoized(Symbol.for('a'));

    expect(func).toHaveBeenCalledTimes(4);
  });
});
