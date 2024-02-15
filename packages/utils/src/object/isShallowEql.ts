/**
 * Checks if two values are the same by shallow comparison.
 *
 * @example
 *
 * const a = {a: 1}
 * const b = {a: 1}
 *
 * a === b //=> false
 *
 * isShallowEql(a, b) //=> true
 *
 * isShallowEql([1, b], [1, b]) //=> true
 *
 * isShallowEql([1, {a: 1}], [1, {a: 1}]) //=> false
 */

export default function isShallowEql(val1: unknown, val2: unknown): boolean {
  if (Object.is(val1, val2)) {
    return true;
  }

  if (typeof val1 === 'object' && typeof val2 === 'object') {
    if (
      Object.prototype.toString.call(val1) !==
      Object.prototype.toString.call(val2)
    ) {
      return false;
    }

    const keys1 = Object.keys(val1 as object);
    const keys2 = Object.keys(val2 as object);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let i = 0; i < keys1.length; i++) {
      if (
        !Object.is(
          (val1 as object)[keys1[i] as keyof typeof val1],
          (val2 as object)[keys2[i] as keyof typeof val2]
        )
      ) {
        return false;
      }
    }
    return true;
  }

  return false;
}
