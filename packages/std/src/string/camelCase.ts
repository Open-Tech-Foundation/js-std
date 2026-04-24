import capitalize from './capitalize';

/**
 * Converts string to camelCase.
 *
 * @example
 *
 * camelCase('Foo Bar') //=> 'fooBar'
 *
 * camelCase('--foo-bar--') //=> 'fooBar'
 *
 * camelCase('__FOO_BAR__') //=> 'fooBar'
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
