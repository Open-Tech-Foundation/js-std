import isEmpty from '../assert/isEmpty';
import isPureObj from '../types/isPureObj';
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
export default function has(obj: object, path: string | unknown[]): boolean {
  const pathArr = toPath(path);

  if (isEmpty(pathArr)) {
    return false;
  }

  let curObj = obj;
  for (const prop of pathArr) {
    if (!isPureObj(curObj)) {
      return false;
    }

    if (!Object.hasOwn(curObj, prop as PropertyKey)) {
      return false;
    }

    curObj = (curObj as IterableObj)[prop as PropertyKey] as object;
  }

  return true;
}
