/**
 * Checks if the given value is an iterable.
 *
 * @example
 *
 * isIterable([1, 2, 3]) //=> true
 *
 * isIterable('abc') //=> true
 *
 * isIterable({}) //=> false
 */
export default function isIterable(val: unknown): val is Iterable<unknown> {
  const maybeIterable = val as { [Symbol.iterator]?: unknown };

  return (
    val !== null &&
    val !== undefined &&
    typeof maybeIterable[Symbol.iterator] === 'function'
  );
}
