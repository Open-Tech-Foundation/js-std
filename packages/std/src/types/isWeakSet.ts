/**
 * Checks if the given value is a WeakSet object.
 *
 * @example
 *
 * isWeakSet(new Set()) //=> false
 *
 * isWeakSet(new WeakSet()) //=> true
 *
 *
 * Checked by probing the internal slot rather than by reading the object's
 * `Object.prototype.toString` tag, which any object can set for itself with
 * `Symbol.toStringTag`. A spoofed tag used to reach code that trusted the
 * answer — `clone` and `isEql` both threw on a plain object tagged `Map` —
 * and the slot cannot be faked. It works across realms either way.
 */

export default function isWeakSet(val: unknown): val is WeakSet<WeakKey> {
  try {
    WeakSet.prototype.has.call(val as WeakSet<WeakKey>, {});
    return true;
  } catch {
    return false;
  }
}
