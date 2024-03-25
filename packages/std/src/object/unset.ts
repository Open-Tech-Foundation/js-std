import isEmpty from '../assert/isEmpty';
import isArr from '../types/isArr';
import clone from './clone';
import { IterableObj } from './merge';
import toPath from './toPath';

/**
 * Removes the property of the given object at the given path.
 *
 * @example
 *
 * unset({a: 1, b: 2}}, 'a') //=> true
 */
export default function unset<T>(obj: T, path: string | unknown[]): T {
  const pathArr = toPath(path);
  const cObj = clone(obj);
  let curObj: IterableObj = cObj as IterableObj;

  if (isEmpty(pathArr)) {
    return obj;
  }

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as PropertyKey;

    if (i === pathArr.length - 1) {
      if (isArr(curObj)) {
        curObj.splice(prop as number, 1);
      } else {
        delete curObj[prop];
      }

      break;
    }

    curObj = curObj[prop] as IterableObj;
  }

  return cObj as T;
}
