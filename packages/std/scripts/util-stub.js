/**
 * `@sinonjs/fake-timers` contains `_global.process && require("util").promisify`.
 * The guard means it is never reached on runtimes without `process`, but esbuild
 * still has to resolve the specifier at build time. This stub satisfies the
 * bundler without dragging a Node builtin into a runtime-agnostic bundle.
 */
export const promisify =
  (fn) =>
  (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, val) => (err ? reject(err) : resolve(val)));
    });

export default { promisify };
