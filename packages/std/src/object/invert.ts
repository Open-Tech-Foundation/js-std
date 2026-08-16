import isUnsafeKey from './isUnsafeKey';

/**
 * Swaps the keys and values of an object.
 *
 * Values become keys, so they are coerced to strings the same way any property
 * name is. The mapping is only reversible when the values are unique — where
 * two keys share a value the later one wins, and the earlier key is lost.
 *
 * @param {T} obj The source object.
 * @returns {Record<string, string>} The inverted object.
 *
 * Because values become keys, a value of `__proto__`, `constructor` or
 * `prototype` is refused and its entry dropped, as writing one would set the
 * result's prototype rather than a property on it.
 *
 * @example
 * invert({ a: 1, b: 2 }) //=> { '1': 'a', '2': 'b' }
 *
 * @example
 * // Turning a code table into a reverse lookup.
 * const STATUS = { ok: 200, notFound: 404 };
 * invert(STATUS) //=> { '200': 'ok', '404': 'notFound' }
 *
 * @example
 * // Duplicate values collapse, keeping the last key.
 * invert({ a: 1, b: 1 }) //=> { '1': 'b' }
 */
export default function invert<T extends object>(
  obj: T,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key of Object.keys(obj)) {
    const inverted = String(obj[key as keyof T]);

    if (isUnsafeKey(inverted)) {
      continue;
    }

    result[inverted] = key;
  }

  return result;
}
