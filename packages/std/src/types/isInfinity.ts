/**
 * Checks if the given value is Infinity.
 *
 * @example
 *
 * isInfinity(0) //=> false
 *
 * isInfinity(NaN) //=> false
 *
 * isInfinity(Infinity) //=> true
 */
export default function isInfinity(x: unknown) {
  if (typeof x !== 'number') return false;
  if (Number.isNaN(x)) return false;
  if (Number.isFinite(x)) return false;

  return true;
}
