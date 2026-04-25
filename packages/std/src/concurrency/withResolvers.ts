/**
 * Creates a promise with custom resolvers for `resolve` and `reject`.
 *
 * @example
 * const { promise, resolve, reject } = withResolvers();
 * Math.random() > 0.5 ? resolve("ok") : reject("not ok");
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
