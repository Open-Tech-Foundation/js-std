/**
 * Executes a function for each item in an iterator.
 *
 * @param {Iterable<T>} iter The iterable to iterate over.
 * @param {(val: T) => void} fn The function to execute.
 *
 * @example
 * eachIter([1, 2, 3], x => console.log(x)) //=> Logs 1, 2, 3
 */
export default function eachIter<T>(
  iter: Iterable<T>,
  fn: (val: T) => void,
): void {
  for (const item of iter) {
    fn(item);
  }
}
