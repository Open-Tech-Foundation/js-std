import capitalize from './capitalize';

/**
 * Converts string to camelCase.
 *
 * @param {string} str The string to convert.
 * @returns {string} The camelCased string.
 *
 * @example
 * camelCase('Foo Bar') //=> 'fooBar'
 */
function camelCase(str: string): string {
  const res = str
    .replace(/([a-z])([A-Z])|([A-Z]+)([A-Z][a-z])/g, '$1$3 $2$4')
    .match(/[a-z0-9]+/gi);

  if (!res) {
    return '';
  }

  const out = res.map((word, i) => {
    if (i === 0) {
      return word.toLowerCase();
    }
    return capitalize(word);
  });

  return out.join('');
}

export default camelCase;
