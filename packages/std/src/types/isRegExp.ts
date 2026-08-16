/**
 * Checks if the given value is a RegExp object.
 *
 * @example
 *
 * isRegExp(new RegExp()) //=> true
 *
 * isRegExp(/a/) //=> true
 *
 * isRegExp({}) //=> false
 *
 *
 * Checked by probing the internal slot rather than by reading the object's
 * `Object.prototype.toString` tag, which any object can set for itself with
 * `Symbol.toStringTag`. A spoofed tag used to reach code that trusted the
 * answer — `clone` and `isEql` both threw on a plain object tagged `Map` —
 * and the slot cannot be faked. It works across realms either way.
 */

const sourceOf = Object.getOwnPropertyDescriptor(
  RegExp.prototype,
  'source',
)?.get;

export default function isRegExp(val: unknown): val is RegExp {
  // `RegExp.prototype` itself answers the getter without being a regexp.
  if (val === RegExp.prototype) {
    return false;
  }

  try {
    sourceOf?.call(val);
    return sourceOf !== undefined;
  } catch {
    return false;
  }
}
