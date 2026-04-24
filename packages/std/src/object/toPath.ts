import compact from '../array/compact';
import isArray from '../types/isArray';
import isNumber from '../types/isNumber';
import isString from '../types/isString';
import isSymbol from '../types/isSymbol';

/**
 * Converts the given value into an object property path array.
 *
 * @example
 * toPath('a.b.c') //=> ['a', 'b', 'c']
 */
export default function toPath(val: string | unknown | unknown[]): unknown[] {
  if (isString(val)) {
    const res = [];
    const regex = /\[(\d+)\]|\[(-?\d+\.?\d+)\]|([^.[\]]+)/g;
    const matches = val.matchAll(regex);
    for (const m of matches) {
      res.push(compact(m)[1]);
    }

    return res;
  }

  if (isArray(val)) {
    return [...val];
  }

  if (isSymbol(val)) {
    return [val];
  }

  if (isNumber(val)) {
    return [String(val)];
  }

  return [];
}
