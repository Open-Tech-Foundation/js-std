/**
 * Splits string into an array of its words.
 *
 * @example
 *
 * words('fred, barney, & pebbles') //=> ['fred', 'barney', 'pebbles']
 *
 * words('fred, barney, & pebbles', /[^, ]+/g) //=> ['fred', 'barney', '&', 'pebbles']
 */
export default function words(
  str: string,
  pattern?: RegExp | string,
): string[] {
  if (pattern === undefined) {
    const wordsRegex = /[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z]|$)|\d+|[a-z]+|[A-Z]+/g;
    return str.match(wordsRegex) || [];
  }
  return str.match(pattern) || [];
}
