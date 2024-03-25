import compact from '../array/compact';
import isArr from '../types/isArr';
import isNum from '../types/isNum';
import isStr from '../types/isStr';
import isSym from '../types/isSym';

/**
 * Converts the given value into an object property path array.
 *
 * @example
 * toPath('a.b.c') //=> ['a', 'b', 'c']
 */
export default function toPath(val: string | unknown | unknown[]) {
  if (isStr(val)) {
    const res = [];
    const regex = /\[(\d+)\]|\[(-?\d+\.?\d+)\]|([^.[\]]+)/g;
    const matches = val.matchAll(regex);
    for (const m of matches) {
      res.push(compact(m)[1]);
    }

    return res;
  }

  if (isArr(val)) {
    return [...val];
  }

  if (isSym(val)) {
    return [val];
  }

  if (isNum(val)) {
    return [String(val)];
  }

  return [];
}
