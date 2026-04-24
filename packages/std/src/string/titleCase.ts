import capitalize from './capitalize';
import words from './words';

/**
 * Converts string to title case.
 *
 * @example
 *
 * titleCase('hello world') //=> 'Hello World'
 *
 * titleCase('foo-bar') //=> 'Foo Bar'
 */
export default function titleCase(str: string): string {
  return words(str)
    .map((word) => capitalize(word.toLowerCase()))
    .join(' ');
}
