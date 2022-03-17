import replaceAt from './replaceAt';

function capitalize(str: string): string {
  if (str.length === 0) {
    return '';
  }

  let result = str.toLowerCase();
  result = replaceAt(result, 0, result[0].toUpperCase());

  return result;
}

export default capitalize;
