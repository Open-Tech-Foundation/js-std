import { createMergeTarget } from './merge';

/**
 * Creates an object composed of the keys that the predicate returns falsy for.
 *
 * @example
 * omitBy({ a: 1, b: '2', c: 3 }, isNumber) //=> { b: '2' }
 */
export default function omitBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: string | symbol) => boolean,
): Partial<T> {
  const result: any = createMergeTarget(obj);
  const keys = [
    ...Object.keys(obj),
    ...Object.getOwnPropertySymbols(obj).filter((sym) =>
      Object.prototype.propertyIsEnumerable.call(obj, sym),
    ),
  ] as (string | symbol)[];

  for (const key of keys) {
    const val = obj[key as keyof T];
    if (!predicate(val, key)) {
      result[key] = val;
    }
  }

  return result;
}
