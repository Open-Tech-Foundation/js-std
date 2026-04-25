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
    throw new Error('Input must be a string');
  }

  return str.replace(
    /[\u001b\u009b]\[[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  );
}
