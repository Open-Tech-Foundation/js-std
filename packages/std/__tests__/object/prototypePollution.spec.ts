import {
  countBy,
  flattenObject,
  groupBy,
  invert,
  keyBy,
  mapKeys,
  mapValues,
  merge,
  mergeAll,
  omitBy,
  pickBy,
  set,
  shallowMerge,
  shallowMergeAll,
  toSet,
  toUnset,
  unflattenObject,
  unset,
} from '../../src';

/** An object carrying an own `__proto__` key, as `JSON.parse` produces it. */
function hostile(payload = '{"isAdmin":true}'): Record<string, unknown> {
  return JSON.parse(`{"safe":1,"__proto__":${payload}}`);
}

/** Every guarded key, checked the same way. */
const UNSAFE = ['__proto__', 'constructor', 'prototype'] as const;

function expectClean(out: unknown): void {
  const proto = Object.getPrototypeOf(out as object);

  expect(proto === Object.prototype || proto === Array.prototype).toBe(true);
  expect((out as Record<string, unknown>).isAdmin).toBeUndefined();
  expect('isAdmin' in (out as object)).toBe(false);
}

describe('Object > prototype pollution', () => {
  // The payload lands on Object.prototype itself rather than on one result,
  // so it has to be checked once globally as well as per function.
  afterEach(() => {
    expect(({} as Record<string, unknown>).isAdmin).toBeUndefined();
    expect(({} as Record<string, unknown>).pwned).toBeUndefined();
  });

  test('own __proto__ keys never become a prototype', () => {
    expect(Object.hasOwn(hostile(), '__proto__')).toBe(true);

    expectClean(pickBy(hostile(), () => true));
    expectClean(omitBy(hostile(), () => false));
    expectClean(mapValues(hostile(), (v) => v));
    expectClean(mapKeys(hostile(), (_v, k) => k));
    expectClean(shallowMerge({ safe: 0 }, hostile()));
    expectClean(shallowMergeAll({ safe: 0 }, hostile()));
    expectClean(merge({ safe: 0 }, hostile()));
    expectClean(mergeAll({ safe: 0 }, hostile()));
    expectClean(flattenObject(hostile()));
  });

  test('shallowMerge does not let an untrusted body reach the prototype', () => {
    const body = JSON.parse(
      '{"theme":"dark","__proto__":{"isAdmin":true,"role":"root"}}',
    );
    const cfg = shallowMerge({ theme: 'light' }, body) as Record<
      string,
      unknown
    >;

    expect(cfg.theme).toBe('dark');
    expect(cfg.isAdmin).toBeUndefined();
    expect(cfg.role).toBeUndefined();
    expect(Object.getPrototypeOf(cfg)).toBe(Object.prototype);
  });

  test('pickBy keeps its allow-list closed over unsafe keys', () => {
    const out = pickBy(hostile(), (_v, k) => k === 'safe') as Record<
      string,
      unknown
    >;

    expect(Object.keys(out)).toEqual(['safe']);
    expectClean(out);
  });

  test('keyBy does not adopt a record as the lookup prototype', () => {
    for (const id of UNSAFE) {
      const out = keyBy([{ id, pwned: true }, { id: 'b2' }], 'id') as Record<
        string,
        unknown
      >;

      expect(Object.keys(out)).toEqual(['b2']);
      expect(Object.getPrototypeOf(out)).toBe(Object.prototype);
      expect((out as Record<string, unknown>).pwned).toBeUndefined();
    }
  });

  test('groupBy does not throw on unsafe keys', () => {
    for (const t of UNSAFE) {
      const out = groupBy([{ t }, { t: 'ok' }], 't');

      expect(out).toEqual({ ok: [{ t: 'ok' }] });
      expect(Object.getPrototypeOf(out)).toBe(Object.prototype);
    }
  });

  test('countBy counts only safe keys, and counts them as numbers', () => {
    for (const t of UNSAFE) {
      const out = countBy([{ t }, { t }, { t: 'ok' }], 't');

      expect(out).toEqual({ ok: 1 });
      expect(Object.keys(out)).toEqual(['ok']);
    }
  });

  test('invert checks the value, since the value becomes the key', () => {
    for (const value of UNSAFE) {
      const out = invert({ a: value, b: 'x' });

      expect(out).toEqual({ x: 'b' });
      expect(Object.getPrototypeOf(out)).toBe(Object.prototype);
    }
  });

  test('flattenObject drops unsafe branches at any depth', () => {
    expect(flattenObject(hostile('{"nested":{"deep":1}}'))).toEqual({
      safe: 1,
    });
    expect(flattenObject(JSON.parse('{"a":{"__proto__":{"x":1}},"b":2}'))).toEqual(
      { b: 2 },
    );
  });

  test('unflattenObject refuses unsafe path segments', () => {
    for (const key of UNSAFE) {
      expect(unflattenObject({ [`${key}.isAdmin`]: true })).toEqual({});

      // The whole path is refused before anything is written, so no partial
      // branch is left behind either.
      expect(unflattenObject({ [`a.${key}.isAdmin`]: true })).toEqual({});
    }
  });

  test('set refuses unsafe path segments', () => {
    for (const key of UNSAFE) {
      const target: Record<string, unknown> = {};

      set(target, `${key}.isAdmin`, true);
      set(target, [key, 'isAdmin'], true);
      set(target, `a.${key}.isAdmin`, true);
      set(target, `a.b.${key}`, true);

      // Refused whole: not even the branch leading up to the unsafe segment.
      expect(target).toEqual({});
    }
  });

  test('every path mutator refuses an unsafe path whole', () => {
    for (const key of UNSAFE) {
      const paths = [`${key}.isAdmin`, `a.${key}.isAdmin`, `a.b.${key}`];

      for (const path of paths) {
        const target: Record<string, unknown> = { a: { b: { c: 1 } } };
        const before = JSON.parse(JSON.stringify(target));

        expect(set(target, path, true)).toBe(target);
        expect(target).toEqual(before);

        expect(unset(target, path)).toBe(target);
        expect(target).toEqual(before);

        // The copying forms hand back the original, not a clone.
        expect(toSet(target, path, true)).toBe(target);
        expect(toUnset(target, path)).toBe(target);
        expect(target).toEqual(before);
      }
    }
  });

  test('a flatten -> unflatten round trip stays clean', () => {
    const out = unflattenObject(flattenObject(hostile()));

    expect(out).toEqual({ safe: 1 });
    expectClean(out);
  });

  test('symbol keys are still copied, being unable to name an unsafe key', () => {
    const sym = Symbol('keep');
    const input: Record<string | symbol, unknown> = { a: 1, [sym]: 2 };

    expect((pickBy(input, () => true) as Record<symbol, unknown>)[sym]).toBe(2);
    expect((mapValues(input, (v) => v) as Record<symbol, unknown>)[sym]).toBe(2);
    expect(
      (shallowMerge({}, input) as Record<symbol, unknown>)[sym],
    ).toBe(2);
  });

  test('null-prototype results are still null-prototype', () => {
    const input = Object.create(null) as Record<string, unknown>;
    input.a = 1;

    expect(Object.getPrototypeOf(pickBy(input, () => true))).toBe(null);
    expect(Object.getPrototypeOf(shallowMerge(input, { b: 2 }))).toBe(null);
  });
});
