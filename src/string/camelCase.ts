import capitalize from './capitalize';
import replaceAt from './replaceAt';

function camelCase(str: string): string {
  const result = str.match(/[a-z0-9]+/gi);

  if (result) {
    if (result.length === 1) {
      return replaceAt(result[0], 0, result[0][0].toLowerCase());
    }

    result[0] = replaceAt(result[0], 0, result[0].toLowerCase());
    for (let i = 1; i < result.length; i++) {
      result[i] = capitalize(result[i]);
    }

    return result.join('');
  }

  return str;
}

export default camelCase;
