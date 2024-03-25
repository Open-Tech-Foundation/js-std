/**
 *  Array forEach with `Async` callback function.
 *
 * @example
 *
 * await asyncForEach([1, 3, 5], async () => await someDelayedFn())
 */
export default async function asyncForEach<T>(
  arr: T[],
  cb: (value: T, index: number) => Promise<void>
): Promise<undefined> {
  return arr.reduce(async (_acc: unknown, cur: T, i) => {
    await cb(cur, i);
  }, null) as Promise<undefined>;
}
