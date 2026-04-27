import isFunction from '../types/isFunction';
import isString from '../types/isString';

/**
 * Inserts a separator between the elements of its list argument.
 *
 * @param {string|unknown[]} list The source list.
 * @param {Function|unknown} sep The separator to insert.
 * @returns {string|unknown[]} A new list with the separator inserted.
 *
 * @example
 * intersperse([1, 2, 3], '*') //=> [1, '*', 2, '*', 3]
 * intersperse('Hello', '-') //=> "H-e-l-l-o"
 */
export default function intersperse(
  list: string | unknown[],
  sep: ((index: number) => unknown) | unknown,
): string | unknown[] {
  const a = isString(list) ? Array.from(list) : list;

  if (!a || a.length === 0) {
    return isString(list) ? '' : [];
  }

  const res: unknown[] = [];

  for (let i = 0; i < a.length; i++) {
    res.push(a[i]);
    if (i < a.length - 1) {
      res.push(isFunction(sep) ? sep(i) : sep);
    }
  }

  return isString(list) ? res.join('') : res;
}
