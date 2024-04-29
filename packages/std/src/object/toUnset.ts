import isEmpty from '../assert/isEmpty';
import isArr from '../types/isArr';
import isNum from '../types/isNum';
import isObj from '../types/isObj';
import clone from './clone';
import { IterableObj } from './merge';
import toPath from './toPath';

/**
 * Removes the property of the given object at the given path & returns new object.
 *
 * @example
 *
 * unset({a: 1, b: 2}}, 'a') //=> true
 */
export default function unset<T>(obj: T, path: string | unknown[]): T {
  const pathArr = toPath(path);

  if (isEmpty(pathArr) || !(isObj(obj) || isArr(obj))) {
    return obj;
  }

  const cObj = clone(obj);
  let curObj: IterableObj = cObj as IterableObj;

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as PropertyKey;

    if (i === pathArr.length - 1) {
      if (isArr(curObj)) {
        if (isNum(prop, true)) {
          curObj.splice(prop, 1);
        }
      } else {
        delete curObj[prop];
      }
      break;
    }

    curObj = curObj[prop] as IterableObj;

    if (!(isObj(curObj) || isArr(curObj))) {
      return cObj;
    }
  }

  return cObj as T;
}
