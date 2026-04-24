/**
 * Pads string on the left and right sides if it's shorter than length.
 * Padding characters are truncated if they can't be evenly divided by length.
 *
 * @example
 *
 * pad('abc', 8) //=> '  abc   '
 *
 * pad('abc', 8, '_-') //=> '_-abc_-_'
 *
 * pad('abc', 3) //=> 'abc'
 */
export default function pad(str: string, length = 0, chars = ' '): string {
  const strLength = str.length;
  if (strLength >= length) {
    return str;
  }
  const mid = (length - strLength) / 2;
  const leftLength = Math.floor(mid);
  const rightLength = Math.ceil(mid);

  const leftPad = chars
    .repeat(Math.ceil(leftLength / chars.length))
    .slice(0, leftLength);
  const rightPad = chars
    .repeat(Math.ceil(rightLength / chars.length))
    .slice(0, rightLength);

  return leftPad + str + rightPad;
}
