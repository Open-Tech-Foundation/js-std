import words from './words';

/**
 * Converts string to snake_case.
 *
 * @example
 *
 * snakeCase('Foo Bar') //=> 'foo_bar'
 *
 * snakeCase('fooBar') //=> 'foo_bar'
 *
 * snakeCase('--FOO-BAR--') //=> 'foo_bar'
 */
export default function snakeCase(str: string): string {
  return words(str)
    .map((word) => word.toLowerCase())
    .join('_');
}
