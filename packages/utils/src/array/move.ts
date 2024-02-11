/**
 * It moves an array element from one index position to another.
 *
 * Note: It mutates the array.
 *
 * @example
 *
 * move([1, 2, 3], 0, 2) //=> [2, 3, 1]
 */

export default function move<T>(arr: T[], from: number, to: number): T[] {
  if (arr.length === 0 || from === to || from >= arr.length) {
    return arr;
  }

  arr.splice(to, 0, arr.splice(from, 1)[0]);

  return arr;
}
