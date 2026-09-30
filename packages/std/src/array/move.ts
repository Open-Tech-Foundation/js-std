/** Source and destination indexes for {@link move}. */
export interface MoveOptions {
  /** The index of the element to move. */
  from: number;
  /** The index to move the element to. */
  to: number;
}

/**
 * Moves an array element from one index position to another.
 *
 * @param {T[]} arr The source array.
 * @param {MoveOptions} options The source and destination indexes.
 * @returns {T[]} A new array with the moved element.
 *
 * @example
 * move([1, 2, 3], { from: 0, to: 2 }) //=> [2, 3, 1]
 */
export default function move<T>(arr: T[], { from, to }: MoveOptions): T[] {
  if (arr.length === 0 || from === to || from >= arr.length) {
    return arr;
  }

  const a = [...arr];
  a.splice(to, 0, a.splice(from, 1)[0]);

  return a;
}
