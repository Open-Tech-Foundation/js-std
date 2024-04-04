/**
 *  Array forEach with `Async` callback function.
 *
 * @example
 *
 * await aForEach([1, 3, 5], async () => await someDelayedFn())
 */
export default async function aForEach<T>(
  arr: T[],
  cb: (value: T, index: number) => Promise<void>
): Promise<undefined> {
  let i = 0;

  for (const e of arr) {
    await cb(e, i);
    i++;
  }
}
