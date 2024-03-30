import isFn from '../types/isFn';
import isStr from '../types/isStr';
import drop from './drop';

/**
 * Inserts a separator between the elements of its list argument.
 *
 * @example
 *
 * const arr = [1, 2, 3];
 * intersperse(arr, '*') //=> [1, '*', 2, '*', 3]
 *
 * intersperse('Hello', '-') //=> H-e-l-l-o
 */
export default function intersperse(
  list: string | unknown[] = [],
  sep: ((index: number) => unknown) | unknown
): string | unknown[] {
  const a = isStr(list) ? Array.from(list) : list;
  const res = drop(
    a.reduce((acc: unknown[], cur, index) => {
      acc.push(isFn(sep) ? sep(index - 1) : sep, cur);
      return acc;
    }, [])
  );

  return isStr(list) ? (res.join('') as string) : res;
}
