import replaceAt from './replaceAt';

function capitalize(str: string): string {
  if (str.length === 0) {
    return '';
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default capitalize;
