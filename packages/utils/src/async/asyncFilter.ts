/**
 *  Array filter with `Async` callback function.
 *
 * @param arr unknown[]
 * @param cb - The callback funtion
 * @returns The filtered array
 */
export default async function asyncFilter<T>(
  arr: T[],
  cb: (value: T, index: number) => Promise<boolean>
): Promise<Partial<T[]>> {
  return arr.reduce(async (acc: unknown, cur: T, i: number) => {
    const bool = await cb(cur, i);
    return bool ? [...(await (acc as Promise<unknown[]>)), arr[i]] : acc;
  }, []) as Partial<T[]>;
}
