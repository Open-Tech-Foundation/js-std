/**
 * Returns a boolean  indicating if this set has no elements in common with the given set.
 *
 * @example
 *
 * const a = [1, 3, 5]
 * const b = [2, 4]
 * isDisjointFrom(a, b) //=> true
 */
export default function isDisjointFrom(
  a: unknown[] | Set<unknown>,
  b: unknown[] | Set<unknown>
): boolean {
  const setA = new Set(a);
  const setB = new Set(b);

  if (setA.size > setB.size) {
    for (const e of setB) {
      if (setA.has(e)) {
        return false;
      }
    }

    return true;
  }

  for (const e of setA) {
    if (setB.has(e)) {
      return false;
    }
  }

  return true;
}
