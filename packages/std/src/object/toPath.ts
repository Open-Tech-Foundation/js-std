import compact from '../array/compact';
import isArray from '../types/isArray';
import isNumber from '../types/isNumber';
import isString from '../types/isString';
import isSymbol from '../types/isSymbol';

/**
 * The location of a property within an object: either a dot-and-bracket
 * string such as `'a.b[0].c'`, or the segments it parses into.
 */
export type PropertyPath = string | unknown[];

/**
 * Converts the given value into an object property path array.
 *
 * A number or a symbol is a single-segment path, and anything else has no
 * segments at all, so it yields an empty array.
 *
 * @param {PropertyPath|number|symbol} val The value to convert.
 * @returns {unknown[]} The path segments.
 *
 * @example
 * toPath('a.b.c') //=> ['a', 'b', 'c']
 */
export default function toPath(val: PropertyPath | number | symbol): unknown[] {
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
