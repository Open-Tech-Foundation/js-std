/**
 * Accumulates values from an iterator using a reducer function.
 *
 * @param {Iterable<T>} iter The iterable to reduce.
 * @param {(acc: U, val: T) => U} fn The reducer function.
 * @param {ReduceIterOptions} options The initial accumulator value.
 * @returns {U} The final accumulator value.
 *
 * @example
 * reduceIter([1, 2, 3], (acc, x) => acc + x, { initialValue: 0 }) //=> 6
 */
export default function reduceIter<T, U>(
  iter: Iterable<T>,
  fn: (acc: U, val: T) => U,
  { initialValue }: ReduceIterOptions<U>,
): U {
  let acc = initialValue;
  for (const item of iter) {
    acc = fn(acc, item);
  }
  return acc;
}
/** Options for {@link reduceIter}. */
export interface ReduceIterOptions<U> {
  /** The initial accumulator value. */
  initialValue: U;
}
