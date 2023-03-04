/**
 * It generates a sequence of numbers starting at the first argument,
 * progressing by the third argument, and stopping at the second argument.
 *
 * @example
 *
 * range(0, 5) // [0, 1, 2, 3, 4, 5]
 * range(10, 50, 10) // [10, 20, 30, 40, 50]
 */

export default function range(start = 0, stop: number, step = 1): number[] {
  if (step === 0) return [];
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step
  );
}
