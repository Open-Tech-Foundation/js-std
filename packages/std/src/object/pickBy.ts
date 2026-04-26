/**
 * Creates an object composed of the keys that the predicate returns truthy for.
 *
 * @example
 * pickBy({ a: 1, b: '2', c: 3 }, isNumber) //=> { a: 1, c: 3 }
 */
export default function pickBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: string) => boolean,
): Partial<T> {
  const result: any = {};

  for (const key of Object.keys(obj)) {
    const val = obj[key as keyof T];
    if (predicate(val, key)) {
      result[key] = val;
    }
  }

  return result;
}
