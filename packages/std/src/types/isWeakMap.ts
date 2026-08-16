/**
 * Checks if the given value is a WeakMap object.
 *
 * @example
 *
 * isWeakMap(new Map()) //=> false
 *
 * isWeakMap(new WeakMap()) //=> true
 *
 *
 * Checked by probing the internal slot rather than by reading the object's
 * `Object.prototype.toString` tag, which any object can set for itself with
 * `Symbol.toStringTag`. A spoofed tag used to reach code that trusted the
 * answer — `clone` and `isEql` both threw on a plain object tagged `Map` —
 * and the slot cannot be faked. It works across realms either way.
 */

export default function isWeakMap(
  val: unknown,
): val is WeakMap<WeakKey, unknown> {
  try {
    WeakMap.prototype.has.call(val as WeakMap<WeakKey, unknown>, {});
    return true;
  } catch {
    return false;
  }
}
