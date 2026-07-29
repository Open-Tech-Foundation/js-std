/**
 * A comprehensive pattern for ANSI escape codes.
 *
 * CSI: [\u001b\u009b]\[[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]
 * OSC: [\u001b\u009b]\][0-9;]*[^\u001b\u009b\u0007]*[\u001b\u009b\u0007\\]
 * Other: [\u001b\u009b][ABCDEFGHJKSTfmhnqrsu] | [\u001b\u009b][\]\^\\_]
 *
 * Exported for `wordWrap`, which has to keep a sequence intact when it splits
 * a word rather than only measure around it. Internal — not a public export.
 *
 * The `g` flag makes `lastIndex` stateful, so every use must reset it first.
 */
export const ANSI_REGEX =
  /[\u001b\u009b][\[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]|[\u001b\u009b]\][0-9;]*[^\u001b\u009b\u0007]*[\u001b\u009b\u0007\\]|[\u001b\u009b][ABCDEFGHJKSTfmhnqrsu]|[\u001b\u009b][\]\^\\_]/g;

/**
 * Removes ANSI escape codes from a string.
 *
 * @example
 *
 * stripANSI('\u001b[31mHello\u001b[0m')
 * //=> 'Hello'
 */
export default function stripANSI(str: string): string {
  if (typeof str !== 'string') {
    return str;
  }

  ANSI_REGEX.lastIndex = 0;

  return str.replace(ANSI_REGEX, '');
}
