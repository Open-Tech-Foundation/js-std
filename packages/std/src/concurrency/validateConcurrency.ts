export default function validateConcurrency(concurrency: number): void {
  if (
    concurrency !== Number.POSITIVE_INFINITY &&
    (!Number.isInteger(concurrency) || concurrency <= 0)
  ) {
    throw new RangeError('Concurrency must be a positive integer or Infinity.');
  }
}
