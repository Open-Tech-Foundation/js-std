/**
 * Generates a cryptographically strong random float within a range.
 *
 * @param min - The minimum value (inclusive).
 * @param max - The maximum value (exclusive).
 * @returns A random float between min and max.
 *
 * @example
 *
 * randomFloat(0, 1) //=> 0.456789123456789
 * randomFloat(1, 5) //=> 3.141592653589793
 */
export default function randomFloat(min: number, max: number): number {
  if (min >= max) {
    throw new Error('The min value must be less than the max value.');
  }
  const array = new Uint32Array(2);
  globalThis.crypto.getRandomValues(array);
  const fraction = (array[0] * 2 ** 32 + array[1]) / 2 ** 64;
  return min + fraction * (max - min);
}
