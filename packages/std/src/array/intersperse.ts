import isFunction from '../types/isFunction';
import isString from '../types/isString';

/**
 * Inserts a separator between the elements of its list argument.
 *
 * Passing a function calls it for each gap, with the index of that gap, and
 * inserts what it returns. A function cannot be distinguished from a value to
 * insert by type, so `sep` is `unknown` and the form is chosen at run time.
 *
 * @param {string|unknown[]} list The source list.
 * @param {unknown} sep The separator to insert, or a function returning it.
 * @returns {string|unknown[]} A new list with the separator inserted.
 *
 * @example
 * intersperse([1, 2, 3], '*') //=> [1, '*', 2, '*', 3]
 * intersperse('Hello', '-') //=> "H-e-l-l-o"
 *
 * @example
 * intersperse([1, 2, 3], (i) => i) //=> [1, 0, 2, 1, 3]
 */
export default function intersperse(
  list: string | unknown[],
  sep: unknown,
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
