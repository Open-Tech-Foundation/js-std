/**
 * Capitalizes the first letter of a string and lowers the rest.
 *
 * @param {string} str The string to capitalize.
 * @returns {string} The capitalized string.
 *
 * @example
 * capitalize('HELLO') //=> 'Hello'
 */
export default function capitalize(str: string): string {
  if (str.length === 0) {
    return '';
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
