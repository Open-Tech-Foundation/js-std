/**
 *  Array filter with `Async` callback function.
 *
 * @param arr unknown[]
 * @param cb - The callback funtion
 * @returns The filtered array
 */
export default async function asyncFilter(
  arr: unknown[],
  cb: (value: unknown, index: number) => Promise<boolean>
): Promise<unknown[]> {
  const newArr = await arr.reduce(
    async (acc: unknown, curVal: unknown, i: number) => {
      const bool = await cb(curVal, i);
      return bool ? ((await acc) as unknown[]).concat(arr[i]) : acc;
    },
    []
  );

  return newArr as unknown[];
}
