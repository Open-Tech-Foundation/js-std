/**
 * Performs left-to-right function composition.
 *
 * @param {Function[]} fns The functions to pipe.
 * @returns {Function} A new function that pipes its arguments.
 *
 * @example
 * const addAbs = pipe((a, b) => a + b, Math.abs);
 * addAbs(-2, -3) //=> 5
 */
export default function pipe(
  ...fns: ((...args: any[]) => any)[]
): (...args: any[]) => any {
  return (...args) => {
    if (fns.length === 0) return;

    const [firstFn, ...restFns] = fns;
    let res = firstFn(...args);

    for (let i = 0; i < restFns.length; i++) {
      if (res instanceof Promise) {
        return (async () => {
          for (let j = i; j < restFns.length; j++) {
            res = await restFns[j](await res);
          }
          return res;
        })();
      }
      res = restFns[i](res);
    }

    return res;
  };
}
