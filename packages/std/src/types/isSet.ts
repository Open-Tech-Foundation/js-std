/**
 * Checks if the given value is a Set object.
 *
 * @example
 *
 * isSet(new Set()) //=> true
 *
 * isSet(new WeakSet()) //=> false
 *
 * isSet({}) //=> false
 *
 *
 * Checked by probing the internal slot rather than by reading the object's
 * `Object.prototype.toString` tag, which any object can set for itself with
 * `Symbol.toStringTag`. A spoofed tag used to reach code that trusted the
 * answer — `clone` and `isEql` both threw on a plain object tagged `Map` —
 * and the slot cannot be faked. It works across realms either way.
 */

export default function isSet(val: unknown): val is Set<unknown> {
  try {
    Set.prototype.has.call(val as Set<unknown>, undefined);
    return true;
  } catch {
    return false;
  }
}
