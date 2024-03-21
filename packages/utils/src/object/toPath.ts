import toNum from '../number/toNum';
import isNum from '../types/isNum';

/**
 * Converts the given string into an object property path array.
 *
 * @example
 * toPath('a.b.c') //=> ['a', 'b', 'c']
 */
export default function toPath(str: string = ''): (string | number)[] {
  const arr = str.match(/(\w+)/g) ?? [];
  return arr.map((i) => {
    return isNum(i, true) ? toNum(i) : i;
  });
}
