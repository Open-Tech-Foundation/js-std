import isFunction from '../types/isFunction';

/**
 * Creates an object composed of keys generated from the results of running each element of collection through iteratee.
 *
 * @param {T[]} arr The source array.
 * @param {Function|string} by The iteratee to transform keys.
 * @returns {Record<string, number>} The composed aggregate object.
 *
 * @example
 * countBy([6.1, 4.2, 6.3], Math.floor) //=> { '4': 1, '6': 2 }
 */
export default function countBy<T>(
  arr: T[],
  by: ((val: T) => string) | string,
): Record<string, number> {
  return arr.reduce((acc: Record<string, number>, cur) => {
    const k = (isFunction(by) ? by(cur) : cur[by as keyof T]) as string;
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
}
