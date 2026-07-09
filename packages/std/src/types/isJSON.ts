import isPlainObject from './isPlainObject';
/**
 * Checks whether the given value is a valid JSON plain object string.
 *
 * @example
 *
 * isJSON("null") //=> false
 *
 * isJSON("[]") //=> false
 *
 * isJSON("{}") //=> true
 */

export default function isJSON(val: unknown): boolean {
  if (typeof val !== 'string') {
    return false;
  }

  try {
    const o = JSON.parse(val);
    return isPlainObject(o);
  } catch (error) {
    return false;
  }
}
