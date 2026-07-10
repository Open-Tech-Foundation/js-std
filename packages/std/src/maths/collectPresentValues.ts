export default function collectPresentValues<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number,
): number[] {
  const values: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (!Object.hasOwn(arr, i)) {
      continue;
    }

    values.push(cb ? cb(arr[i] as T, i) : (arr[i] as unknown as number));
  }

  return values;
}
