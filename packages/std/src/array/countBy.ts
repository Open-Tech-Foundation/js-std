import isFn from '../types/isFn';

/**
 *  Counts the items in the given array and groups them by the name provided.
 *
 * @example
 *
 * countBy([1, 2, 3, 4, 5], n => n % 2 === 0 ? 'Even' : 'Odd') //=> { Odd: 3, Even: 2 }
 */
export default function countBy<T>(
  arr: T[] = [],
  by: ((val: T) => string) | string
): { [k: string]: number } {
  return arr.reduce((acc: Record<string, number>, cur: T) => {
    const k = isFn(by) ? by(cur) : (cur[by as keyof T] as string);
    const count = acc[k] ? acc[k] + 1 : 1;
    return { ...acc, [k]: count };
  }, {});
}
