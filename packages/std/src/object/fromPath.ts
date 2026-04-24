import isNumber from '../types/isNumber';

/**
 * Converts the given array values into an object property path string.
 *
 * @example
 * fromPath(['a', '0', 'b', 'c']) //=> 'a[0].b.c'
 */
export default function fromPath(arr: (string | number)[] = []): string {
  const out = arr.reduce((acc, cur) => {
    return isNumber(cur, true) ? `${acc}[${cur}]` : `${acc}.${cur}`;
  }, '');

  return (out as string).slice(1);
}
