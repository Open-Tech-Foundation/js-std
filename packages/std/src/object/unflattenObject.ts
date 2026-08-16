import isPlainObject from '../types/isPlainObject';
import set, { MAX_ARRAY_INDEX } from './set';
import toPath from './toPath';

function isIndex(segment: unknown): boolean {
  if (typeof segment !== 'string' || !/^(?:0|[1-9]\d*)$/.test(segment)) {
    return false;
  }

  // The root array is chosen from the keys of untrusted input, so it is bounded
  // for the same reason `set` bounds the branches below it.
  return Number(segment) <= MAX_ARRAY_INDEX;
}

/**
 * Expands a one-level object keyed by path back into a nested one.
 *
 * The inverse of `flattenObject`, and the reader for the flat shapes that
 * arrive from elsewhere — form bodies, query strings, environment maps and the
 * dotted keys configuration files use.
 *
 * Keys are parsed with `toPath`, so both `'a.b'` and `'a[0].b'` are understood,
 * and each is written with `set`. A level whose keys are all indices becomes an
 * array, which is the rule `set` already applies within a path and is applied
 * here to the root as well — so `{ '[0]': 'a' }` gives `['a']` rather than
 * `{ 0: 'a' }`, and a flattened array survives the round trip.
 *
 * Keys are applied in the order the object gives them. Where two disagree — one
 * naming a branch the other names a leaf — the later wins for the leaf and is
 * ignored for the branch, matching `set`.
 *
 * A level whose keys are numeric becomes an array only up to `MAX_ARRAY_INDEX`
 * (10,000). A flat object is very often untrusted input, and a lone large index
 * such as `{ 'a[100000000]': 1 }` would otherwise expand into an array whose
 * `length` makes serialising the result cost hundreds of megabytes. Above the
 * limit the level is a plain object keyed by the number, so no value is lost.
 *
 * `__proto__`, `constructor` and `prototype` are refused as path segments, as
 * they are everywhere in this module. A flat object is very often untrusted
 * input, which is the whole reason this function exists, and expanding one of
 * those keys is how a prototype gets polluted.
 *
 * @param {Record<string, unknown>} obj The flat object to expand.
 * @returns {Record<string, unknown>|unknown[]} The nested object.
 *
 * @example
 * unflattenObject({ 'a.b.c': 1 }) //=> { a: { b: { c: 1 } } }
 *
 * @example
 * unflattenObject({ 'a[0]': 1, 'a[1]': 2 }) //=> { a: [1, 2] }
 *
 * @example
 * unflattenObject({ 'user.name': 'Tom', 'user.age': 30 })
 * //=> { user: { name: 'Tom', age: 30 } }
 */
export default function unflattenObject(
  obj: Record<string, unknown> = {},
): Record<string, unknown> | unknown[] {
  if (!isPlainObject(obj)) {
    return {};
  }

  const paths = Object.keys(obj).map((key) => [key, toPath(key)] as const);
  const rootIsArray =
    paths.length > 0 &&
    paths.every(([, path]) => path.length > 0 && isIndex(path[0]));

  const out: Record<string, unknown> | unknown[] = rootIsArray ? [] : {};

  for (const [key, path] of paths) {
    set(out, path, obj[key]);
  }

  return out;
}
