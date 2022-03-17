import camelCase from './camelCase';
import replaceAt from './replaceAt';

function pascalCase(str: string): string {
  const result = camelCase(str);

  return replaceAt(result, 0, result[0].toUpperCase());
}

export default pascalCase;
