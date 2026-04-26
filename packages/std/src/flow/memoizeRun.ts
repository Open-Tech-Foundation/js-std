/**
 * Caches the results of an asynchronous function.
 * Supports Single Flight (concurrent request de-duplication) and TTL.
 *
 * @example
 * const memoized = memoizeRun(fetchUser, { maxAge: 5000 });
 */
export default function memoizeRun<T, Args extends any[]>(
  func: (...args: Args) => Promise<T>,
  options: {
    maxAge?: number;
    key?: (...args: Args) => string;
  } = {},
) {
  const { maxAge, key: keyFn } = options;
  const cache = new Map<string, { result: Promise<T>; timestamp: number }>();

  const memoized = async (...args: Args): Promise<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    const now = Date.now();
    const cached = cache.get(key);

    if (cached) {
      const isExpired = maxAge !== undefined && now - cached.timestamp > maxAge;
      if (!isExpired) {
        return cached.result;
      }
      cache.delete(key);
    }

    // Single Flight: We store the promise itself in the cache.
    // Concurrent calls for the same key will receive this same promise.
    const promise = func(...args);
    cache.set(key, { result: promise, timestamp: now });

    try {
      return await promise;
    } catch (error) {
      // If it fails, we remove it from cache so it can be retried immediately
      cache.delete(key);
      throw error;
    }
  };

  memoized.clear = () => {
    cache.clear();
  };

  return memoized;
}
