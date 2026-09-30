/**
 * Returns a boolean indicating if all elements of this set are in the given set.
 *
 * @example
 *
 * const a = [1, 2, 3, 4]
 * const b = [2, 4]
 * isSubsetOf(b, a) //=> true
 * isSubsetOf(a, a, { proper: true }) //=> false
 */
export default function isSubsetOf(
  a: unknown[] | Set<unknown>,
  b: unknown[] | Set<unknown>,
  options?: IsSubsetOfOptions,
): boolean {
  const proper = options?.proper ?? false;
  const setA = new Set(a);
  const setB = new Set(b);

  if (setA.size > setB.size) {
    return false;
  }

  for (const e of setA) {
    if (!setB.has(e)) {
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
export interface IsSubsetOfOptions {
  /** Require `a` to be a strict subset of `b`. Defaults to `false`. */
  proper?: boolean;
}
