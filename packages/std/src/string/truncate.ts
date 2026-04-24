/**
 * Truncates string if it's longer than the given maximum string length.
 * The last characters of the truncated string are replaced with the omission string which defaults to "...".
 *
 * @example
 *
 * truncate('hi-package', 8) //=> 'hi-pa...'
 *
 * truncate('hi-package', 5, '---') //=> 'hi---'
 */
export default function truncate(
  str: string,
  length = 30,
  omission = '...',
): string {
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length - omission.length) + omission;
}
