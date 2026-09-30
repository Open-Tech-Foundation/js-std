import validateStringCount from './validateStringCount';

/** Options for choosing the characters used by {@link pad}. */
export interface PadOptions {
  /** The characters used to pad the string. Defaults to a space. */
  chars?: string;
}

/**
 * Pads string on the left and right sides if it's shorter than length.
 * Padding characters are truncated if they can't be evenly divided by length.
 *
 * @param {string} str The string to pad.
 * @param {number} [length=0] The target length.
 * @param {PadOptions} [options] The characters to use for padding.
 *
 * @example
 *
 * pad('abc', 8) //=> '  abc   '
 *
 * pad('abc', 8, { chars: '_-' }) //=> '_-abc_-_'
 *
 * pad('abc', 3) //=> 'abc'
 *
 * pad('abc', 8, { chars: '' }) //=> 'abc'
 */
export default function pad(
  str: string,
  length = 0,
  options?: PadOptions,
): string {
  validateStringCount(length, 'Length');
  const chars = options?.chars ?? ' ';

  const strLength = str.length;
  if (strLength >= length || chars === '') {
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
