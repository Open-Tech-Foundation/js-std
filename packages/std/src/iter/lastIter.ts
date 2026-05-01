/**
 * Returns the last item from an iterable.
 *
 * @param {Iterable<T>} iter The iterable to get the last item from.
 * @returns {T | undefined} The last item, or undefined.
 *
 * @example
 * lastIter([1, 2, 3]) //=> 3
 */
export default function lastIter<T>(iter: Iterable<T>): T | undefined {
  let last: T | undefined = undefined;
  for (const item of iter) {
    last = item;
  }
  return last;
}
