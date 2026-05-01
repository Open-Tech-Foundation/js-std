/**
 * Checks if the given value is an async iterable.
 *
 * @example
 *
 * isAsyncIterable((async function* () {})()) //=> true
 *
 * isAsyncIterable([]) //=> false
 */
export default function isAsyncIterable(
  val: unknown,
): val is AsyncIterable<unknown> {
  return (
    val !== null &&
    val !== undefined &&
    typeof (val as any)[Symbol.asyncIterator] === 'function'
  );
}
