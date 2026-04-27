/**
 * Creates a promise along with its resolve and reject functions.
 *
 * @returns {Object} An object containing the promise and its resolvers.
 *
 * @example
 * const { promise, resolve, reject } = withResolvers();
 */

export default function withResolvers<T>(): {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
} {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  //@ts-expect-error Ignore errors
  return { promise, resolve, reject };
}
