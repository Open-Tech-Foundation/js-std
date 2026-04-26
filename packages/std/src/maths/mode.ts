/**
 * Calculates the mode of the given array.
 *
 * @example
 *
 * mode([1, 2, 2, 3, 4]) //=> [2]
 * mode([1, 2, 2, 3, 3, 4]) //=> [2, 3]
 */

export default function mode<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => string | number,
): (string | number)[] {
  if (arr.length === 0) {
    return [];
  }
  const frequency = new Map<string | number, number>();
  let maxFreq = 0;
  for (let i = 0; i < arr.length; i++) {
    const val = cb ? cb(arr[i] as T, i) : (arr[i] as unknown as string | number);
    const count = (frequency.get(val) || 0) + 1;
    frequency.set(val, count);
    if (count > maxFreq) {
      maxFreq = count;
    }
  }

  // If all elements are unique, return []
  if (maxFreq === 1) {
    return [];
  }

  const modes: (string | number)[] = [];
  for (const [val, count] of frequency.entries()) {
    if (count === maxFreq) {
      modes.push(val);
    }
  }
  return modes;
}
