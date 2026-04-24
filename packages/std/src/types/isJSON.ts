import isPlainObject from './isPlainObject';
/**
 * Checks whether the given string is a valid JSON plain object
 *
 * @example
 *
 * isJSON("null") //=> false
 *
 * isJSON("[]") //=> false
 *
 * isJSON("{}") //=> true
 */

export default function isJSON(str: string): boolean {
  try {
    const o = JSON.parse(str);
    return isPlainObject(o);
  } catch (error) {
    return false;
  }
}
