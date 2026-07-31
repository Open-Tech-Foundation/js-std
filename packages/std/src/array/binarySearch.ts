const defaultCompare = <T>(a: T, b: T): number => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Finds the index of a value in a sorted array, in `O(log n)` comparisons.
 *
 * `indexOf` scans every element, which is fine until the array is large and the
 * lookup is in a loop. Where the array is already sorted, most of it never
 * needs to be looked at.
 *
 * The array **must** be sorted by the same comparator, ascending. That is a
 * precondition rather than something checked: verifying it would cost the `O(n)`
 * this exists to avoid. An unsorted array gives a meaningless answer rather
 * than an error.
 *
 * The default comparator orders by `<` and `>`, which is what `sort` does, so
 * an array from `sort` can be searched without one. Anything else — objects, a
 * locale collation, a descending order — needs a comparator, given the same way
 * `Array.prototype.sort` takes one.
 *
 * Where a value appears more than once the **first** of them is returned, so
 * the answer does not depend on where the search happened to land.
 *
 * @param {T[]} arr The sorted array to search.
 * @param {T} target The value to find.
 * @param {Function} [compare] Orders two values, as `Array.prototype.sort` does.
 * @returns {number} The index of the first match, or `-1` if there is none.
 *
 * @example
 * binarySearch([1, 3, 5, 7], 5) //=> 2
 *
 * @example
 * binarySearch([1, 3, 5, 7], 4) //=> -1
 *
 * @example
 * // A comparator decides what counts as a match, not just the order
 * binarySearch(['a', 'bb', 'ccc'], 'dd', (a, b) => a.length - b.length) //=> 1
 *
 * @example
 * // Descending, searched with the comparator it was sorted by
 * binarySearch([7, 5, 3, 1], 5, (a, b) => b - a) //=> 1
 */
export default function binarySearch<T>(
  arr: T[] = [],
  target: T,
  compare: (a: T, b: T) => number = defaultCompare,
): number {
  let low = 0;
  let high = arr.length;

  // A lower-bound search: narrow to the first element not ordered before the
  // target, rather than stopping at whichever equal one is met first.
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);

    if (compare(arr[mid], target) < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low < arr.length && compare(arr[low], target) === 0 ? low : -1;
}
