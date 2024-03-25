/**
 *  Array map with `Async` callback function.
 *
 * @example
 * await asyncMap([1, 2, 3], (n) => await someDelayedFn(n))
 */
export default async function asyncMap<T>(
  arr: T[],
  cb: (value: T, index: number) => Promise<unknown>
): Promise<T[]> {
  return arr.reduce(async (acc: unknown, cur: T, i) => {
    const out = await cb(cur, i);
    return [...(await (acc as Promise<unknown[]>)), out];
  }, []) as T[];
}
