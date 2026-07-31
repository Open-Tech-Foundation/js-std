import isArray from '../types/isArray';
import isPlainObject from '../types/isPlainObject';
import fromPath from './fromPath';

function walk(
  val: unknown,
  path: (string | number)[],
  out: Record<string, unknown>,
): void {
  const branch = isPlainObject(val) || isArray(val);

  if (!branch) {
    out[fromPath(path)] = val;
    return;
  }

  const entries: [string | number, unknown][] = isArray(val)
    ? val.map((v, i) => [i, v])
    : Object.entries(val);

  // An empty branch has no leaves to describe it, so it is kept as a value of
  // its own. Dropping it would lose a key that was there. The root is not a
  // key of anything, so an empty one simply flattens to nothing.
  if (entries.length === 0) {
    if (path.length === 0) {
      return;
    }

    out[fromPath(path)] = isArray(val) ? [] : {};
    return;
  }

  for (const [key, v] of entries) {
    walk(v, [...path, key], out);
  }
}

/**
 * Flattens a nested object into a single level, keyed by the path to each
 * value.
 *
 * The keys are the path grammar the rest of this module speaks — dots between
 * properties and brackets around indices — so every key of the result can be
 * handed straight to `get`, `set` or `toPath` against the original object.
 *
 * Nested plain objects and arrays are walked; everything else is a value,
 * including a `Date`, a `Map`, a class instance and `null`. An empty object or
 * array has no leaves to stand for it and so is kept as a value, since dropping
 * it would lose a key that was present.
 *
 * A key already containing a `.` or a `[` cannot be told apart from the path
 * built around it: `{ 'a.b': 1 }` flattens to the same `'a.b'` that
 * `{ a: { b: 1 } }` does. That is a property of the format rather than of this
 * function — `unflattenObject` reads both back as the nested form.
 *
 * @param {object} obj The object to flatten.
 * @returns {Record<string, unknown>} A one-level object keyed by path.
 *
 * @example
 * flattenObject({ a: { b: { c: 1 } } }) //=> { 'a.b.c': 1 }
 *
 * @example
 * flattenObject({ a: [1, 2] }) //=> { 'a[0]': 1, 'a[1]': 2 }
 *
 * @example
 * flattenObject({ a: {}, b: 1 }) //=> { a: {}, b: 1 }
 */
export default function flattenObject(
  obj: object = {},
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  if (!(isPlainObject(obj) || isArray(obj))) {
    return out;
  }

  walk(obj, [], out);

  return out;
}
