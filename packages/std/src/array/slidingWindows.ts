/**
 * Slides a fixed-size window over an array, one element at a time.
 *
 * Unlike `chunk`, which cuts an array into separate pieces, the windows here
 * overlap — every element but the ends appears in several of them. That is what
 * makes it useful for anything comparing neighbours: moving averages, deltas
 * between consecutive readings, n-grams, trend detection.
 *
 * Only whole windows are returned, so an array shorter than the window yields
 * nothing rather than a partial result.
 *
 * @param {T[]} arr The source array.
 * @param {number} size The length of each window.
 * @returns {T[][]} The windows, in order.
 * @throws {Error} If the size is not an integer greater than zero.
 *
 * @example
 * slidingWindows([1, 2, 3, 4], 2) //=> [[1, 2], [2, 3], [3, 4]]
 *
 * @example
 * // A three-point moving average.
 * slidingWindows(readings, 3).map((w) => mean(w))
 *
 * @example
 * // Too short for a whole window.
 * slidingWindows([1, 2], 3) //=> []
 */
export default function slidingWindows<T>(arr: T[] = [], size = 1): T[][] {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error('Size must be an integer greater than zero.');
  }

  const result: T[][] = [];

  for (let i = 0; i + size <= arr.length; i++) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}
