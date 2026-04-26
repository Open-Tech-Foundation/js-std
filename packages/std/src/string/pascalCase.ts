import camelCase from './camelCase';
import replaceAt from './replaceAt';

function pascalCase(str: string): string {
  const result = camelCase(str);

  if (!result) {
    return '';
  }

  return result[0].toUpperCase() + result.slice(1);
}

export default pascalCase;
