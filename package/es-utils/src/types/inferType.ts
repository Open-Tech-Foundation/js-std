import isNumber from './isNumber';

function inferType(str: string): string {
  if (typeof str === 'string') {
    if (str === '') {
      return 'string';
    }

    if (str === 'undefined' || str === 'Undefined') {
      return 'undefined';
    }

    if (str === 'null' || str === 'Null' || str === 'NULL') {
      return 'null';
    }

    const booleans = ['true', 'True', 'TRUE', 'false', 'False', 'FALSE'];

    if (booleans.includes(str)) {
      return 'boolean';
    }

    if (isNumber(str)) {
      return 'number';
    }

    return 'string';
  }

  return 'unknown';
}

export default inferType;
