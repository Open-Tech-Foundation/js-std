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
  const maybeAsyncIterable = val as { [Symbol.asyncIterator]?: unknown };

  return (
    val !== null &&
    val !== undefined &&
    typeof maybeAsyncIterable[Symbol.asyncIterator] === 'function'
  );
}
