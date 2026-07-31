const MAX_LENGTH = Number.MAX_SAFE_INTEGER;

/**
 * Checks if the given value is array-like: it has a valid `length` and so can
 * be indexed from `0` to `length - 1`.
 *
 * A `NodeList`, a `FileList`, `arguments`, a `TypedArray` and a string are all
 * array-like without being arrays, which is what `Array.from` and
 * `Array.prototype.slice.call` exist for. `isArray` rejects every one of them.
 *
 * `length` must be an integer between `0` and `Number.MAX_SAFE_INTEGER`, so an
 * object carrying an unrelated `length` — a negative, a fraction or a string —
 * is not mistaken for a collection.
 *
 * Functions are excluded although they have a `length`: it is their arity, not
 * a count of elements, and treating one as a collection is always a mistake.
 *
 * @param {unknown} val The value to check.
 * @returns {boolean} `true` if the value is array-like.
 *
 * @example
 * isArrayLike([1, 2]) //=> true
 *
 * @example
 * isArrayLike('abc') //=> true
 *
 * @example
 * isArrayLike({ length: 2, 0: 'a', 1: 'b' }) //=> true
 *
 * @example
 * isArrayLike(new Set([1, 2])) //=> false
 *
 * @example
 * isArrayLike((a: number, b: number) => a + b) //=> false
 */
export default function isArrayLike(val: unknown): val is ArrayLike<unknown> {
  if (val === null || val === undefined || typeof val === 'function') {
    return false;
  }

  if (typeof val === 'string') {
    return true;
  }

  if (typeof val !== 'object') {
    return false;
  }

  const { length } = val as { length?: unknown };

  return (
    typeof length === 'number' &&
    Number.isInteger(length) &&
    length >= 0 &&
    length <= MAX_LENGTH
  );
}
