import parseFiniteNumberString from '../number/parseFiniteNumberString';

/**
 * Converts the given array values into an object property path string.
 *
 * @example
 * fromPath(['a', '0', 'b', 'c']) //=> 'a[0].b.c'
 */
export default function fromPath(arr: (string | number)[] = []): string {
  const out = arr.reduce((acc, cur) => {
    if (typeof cur === 'number') {
      return Number.isFinite(cur) ? `${acc}[${cur}]` : `${acc}.${cur}`;
    }

    return !Number.isNaN(parseFiniteNumberString(cur))
      ? `${acc}[${cur}]`
      : `${acc}.${cur}`;
  }, '');

  return out.startsWith('.') ? out.slice(1) : out;
}
