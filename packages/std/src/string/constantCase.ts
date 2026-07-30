import words from './words';

/**
 * Converts string to CONSTANT_CASE.
 *
 * This is `snakeCase` in upper case, the spelling environment variables and
 * action type constants use.
 *
 * @param {string} str The string to convert.
 * @returns {string} The CONSTANT_CASEd string.
 *
 * @example
 *
 * constantCase('Foo Bar') //=> 'FOO_BAR'
 *
 * constantCase('fooBar') //=> 'FOO_BAR'
 *
 * constantCase('--foo-bar--') //=> 'FOO_BAR'
 */
export default function constantCase(str: string): string {
  return words(str)
    .map((word) => word.toUpperCase())
    .join('_');
}
