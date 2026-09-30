/**
 * Reduces an array, keeping every intermediate result rather than only the
 * last one.
 *
 * Where `reduce` answers "what is the total", this answers "what was the total
 * after each step" — running balances, cumulative totals for a chart, prefix
 * sums. The output always has the same length as the input.
 *
 * The initial value is required, so an empty array returns an empty array
 * rather than having to guess a seed.
 *
 * @param {T[]} arr The source array.
 * @param {Function} cb The reducer, invoked per element.
 * @param {RunningReduceOptions} options The initial accumulator value.
 * @returns {A[]} The accumulated value after each element.
 *
 * @example
 * runningReduce([1, 2, 3, 4], (acc, cur) => acc + cur, { initialValue: 0 }) //=> [1, 3, 6, 10]
 *
 * @example
 * // A running balance.
 * runningReduce(transactions, (bal, t) => bal + t.amount, { initialValue: openingBalance })
 */
export default function runningReduce<T, A>(
  arr: T[] = [],
  cb: (accumulator: A, current: T, index: number, arr: T[]) => A,
  { initialValue }: RunningReduceOptions<A>,
): A[] {
  const result: A[] = new Array(arr.length);
  let accumulator = initialValue;

  for (let i = 0; i < arr.length; i++) {
    accumulator = cb(accumulator, arr[i], i, arr);
    result[i] = accumulator;
  }

  return result;
}
/** Options for {@link runningReduce}. */
export interface RunningReduceOptions<A> {
  /** The starting accumulator value. */
  initialValue: A;
}
