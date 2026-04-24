/**
 * Repeats the given string n times.
 *
 * @example
 *
 * repeat('*', 3) //=> '***'
 *
 * repeat('abc', 2) //=> 'abcabc'
 *
 * repeat('abc', 0) //=> ''
 */
export default function repeat(str: string, n = 1): string {
  if (n <= 0) {
    return '';
  }
  return str.repeat(n);
}
