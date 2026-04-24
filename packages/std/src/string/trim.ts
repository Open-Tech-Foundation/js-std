/**
 * Removes leading and trailing whitespace or specified characters from string.
 *
 * @example
 *
 * trim('  abc  ') //=> 'abc'
 *
 * trim('-_-abc-_-', '_-') //=> 'abc'
 */
export default function trim(str: string, chars?: string): string {
  if (chars === undefined) {
    return str.trim();
  }
  const escapedChars = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^[${escapedChars}]+|[${escapedChars}]+$`, 'g');
  return str.replace(regex, '');
}
