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
  return (
    val !== null &&
    val !== undefined &&
    typeof (val as any)[Symbol.iterator] === 'function'
  );
}
