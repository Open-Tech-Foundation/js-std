/**
 * Flattens an array up to the specified depth.
 *
 * @param {T[]} arr The source array.
 * @param {number} depth The maximum recursion depth. Defaults to 1.
 * @returns {any[]} A new flattened array.
 *
 * @example
 * flatten([1, [2, [3, [4]]]]) //=> [1, 2, [3, [4]]]
 * flatten([1, [2, [3, [4]]]], 2) //=> [1, 2, 3, [4]]
 * flatten([1, [2, [3, [4]]]], Infinity) //=> [1, 2, 3, 4]
 */
export default function flatten<T>(arr: T[] = [], depth = 1): any[] {
  if (depth <= 0) {
    return arr.slice();
  }

  const result: any[] = [];

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (Array.isArray(item)) {
      const flattened = flatten(item, depth - 1);
      for (let j = 0; j < flattened.length; j++) {
        result.push(flattened[j]);
      }
    } else {
      result.push(item);
    }
  }

  return result;
}
