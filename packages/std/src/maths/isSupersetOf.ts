/**
 * Returns a boolean indicating if all elements of the given set are in this set.
 *
 * @example
 *
 * const a = [1, 2, 3, 4]
 * const b = [2, 4]
 * isSupersetOf(a, b) //=> true
 * isSupersetOf(a, a, { proper: true }) //=> false
 */
export default function isSupersetOf(
  a: unknown[] | Set<unknown>,
  b: unknown[] | Set<unknown>,
  options?: IsSupersetOfOptions,
): boolean {
  const proper = options?.proper ?? false;
  const setA = new Set(a);
  const setB = new Set(b);

  if (setA.size < setB.size) {
    return false;
  }

  for (const e of setB) {
    if (!setA.has(e)) {
      return false;
    }
  }

  if (proper) {
    if (setA.size === setB.size) {
      return false;
    }
  }

  return true;
}
export interface IsSupersetOfOptions {
  /** Require `a` to be a strict superset of `b`. Defaults to `false`. */
  proper?: boolean;
}
