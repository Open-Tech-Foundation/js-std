/**
 * Returns a Generator that yields the first n items from an Iterable.
 */
export function* takeIter<T>(iterable: Iterable<T>, n: number): Generator<T> {
  let count = 0;
  for (const item of iterable) {
    if (count >= n) break;
    yield item;
    count++;
  }
}

/**
 * Returns a Generator that skips the first n items from an Iterable.
 */
export function* dropIter<T>(iterable: Iterable<T>, n: number): Generator<T> {
  let count = 0;
  for (const item of iterable) {
    if (count < n) {
      count++;
      continue;
    }
    yield item;
  }
}

/**
 * Returns an AsyncGenerator that yields the first n items from an AsyncIterable.
 */
export async function* takeIterAsync<T>(
  iterable: AsyncIterable<T>,
  n: number
): AsyncGenerator<T> {
  let count = 0;
  for await (const item of iterable) {
    if (count >= n) break;
    yield item;
    count++;
  }
}

/**
 * Returns an AsyncGenerator that skips the first n items from an AsyncIterable.
 */
export async function* dropIterAsync<T>(
  iterable: AsyncIterable<T>,
  n: number
): AsyncGenerator<T> {
  let count = 0;
  for await (const item of iterable) {
    if (count < n) {
      count++;
      continue;
    }
    yield item;
  }
}
