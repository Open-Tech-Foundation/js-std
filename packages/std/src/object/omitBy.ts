/**
 * Creates an object composed of the keys that the predicate returns falsy for.
 *
 * @example
 * omitBy({ a: 1, b: '2', c: 3 }, isNumber) //=> { b: '2' }
 */
export default function omitBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: string) => boolean
): Partial<T> {
  const result: any = {};

  for (const key of Object.keys(obj)) {
    const val = obj[key as keyof T];
    if (!predicate(val, key)) {
      result[key] = val;
    }
  }

  return result;
}
