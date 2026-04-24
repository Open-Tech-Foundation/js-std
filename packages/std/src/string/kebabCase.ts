import words from './words';

/**
 * Converts string to kebab-case.
 *
 * @example
 *
 * kebabCase('Foo Bar') //=> 'foo-bar'
 *
 * kebabCase('fooBar') //=> 'foo-bar'
 *
 * kebabCase('__FOO_BAR__') //=> 'foo-bar'
 */
export default function kebabCase(str: string): string {
  return words(str)
    .map((word) => word.toLowerCase())
    .join('-');
}
