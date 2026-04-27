import camelCase from './camelCase';

/**
 * Converts string to PascalCase.
 *
 * @param {string} str The string to convert.
 * @returns {string} The PascalCased string.
 *
 * @example
 * pascalCase('foo bar') //=> 'FooBar'
 */
export default function pascalCase(str: string): string {
  const result = camelCase(str);

  if (!result) {
    return '';
  }

  return result[0].toUpperCase() + result.slice(1);
}
