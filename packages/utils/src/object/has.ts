import isEmpty from '../assert/isEmpty';
import isPureObj from '../types/isPureObj';
import isStr from '../types/isStr';
import { IterableObj } from './merge';
import toPath from './toPath';

/**
 * Checks if the given path exists in the given object.
 *
 * @example
 * has({a: 1}, 'a') //=> true
 * has({a: {b: 2}}, ['a', 'b']) //=> true
 * has({a: {b: 2}}, ['a', 'b', 'c']) //=> false
 */
export default function has(
  obj: object,
  path: string | (string | number)[] = []
): boolean {
  const pathArr = isStr(path) ? toPath(path) : path;

  if (isEmpty(pathArr)) {
    return false;
  }

  let curObj = obj;
  for (const prop of pathArr) {
    if (!isPureObj(curObj)) {
      return false;
    }

    if (!Object.hasOwn(curObj, prop)) {
      return false;
    }

    curObj = (curObj as IterableObj)[prop] as object;
  }

  return true;
}
