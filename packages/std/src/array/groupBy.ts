import isFunction from '../types/isFunction';

/**
 * Creates an object composed of keys generated from the results of running each element of collection through iteratee.
 *
 * @example
 *
 * groupBy([6.1, 4.2, 6.3], Math.floor) //=> { '4': [4.2], '6': [6.1, 6.3] }
 */
export default function groupBy<T>(
  arr: T[],
  key: ((val: T) => string) | keyof T,
): Record<string, T[]> {
  return arr.reduce((acc: Record<string, T[]>, obj) => {
    const k =
      typeof key === 'function' ? key(obj) : (obj[key as keyof T] as string);
    if (!acc[k]) {
      acc[k] = [];
    }
    acc[k].push(obj);
    return acc;
  }, {});
}
