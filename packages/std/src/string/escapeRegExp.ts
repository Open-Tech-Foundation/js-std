/**
 * Escapes the RegExp special characters in string.
 *
 * @example
 * escapeRegExp('[opentf](https://opentf.org/)') //=> '\\[opentf\\]\\(https://opentf\\.org/\\)'
 */
export default function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
