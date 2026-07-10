/**
 * Checks whether the given value is a valid JSON string.
 *
 * @example
 *
 * isJSON("null") //=> true
 *
 * isJSON("[]") //=> true
 *
 * isJSON("{}") //=> true
 */

export default function isJSON(val: unknown): boolean {
  if (typeof val !== 'string') {
    return false;
  }

  try {
    JSON.parse(val);
    return true;
  } catch (error) {
    return false;
  }
}
