import isEmpty from '../assert/isEmpty';
import isFn from '../types/isFn';
import isNum from '../types/isNum';
import { IterableObj } from './merge';
import toPath from './toPath';

/**
 * Sets the value to an object at the given path.
 *
 * @example
 *
 * set({}}, 'a.b', 1) //=> {a: {b: 1} }
 */
export default function set<T>(
  obj: T,
  path: string | unknown[],
  value: unknown | ((val: unknown) => unknown)
): T {
  const pathArr = toPath(path);
  let curObj: IterableObj = obj as IterableObj;

  if (isEmpty(pathArr)) {
    return obj;
  }

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as PropertyKey;

    if (i === pathArr.length - 1) {
      const v = isFn(value) ? value(curObj[prop]) : value;
      curObj[prop] = v;
      break;
    }

    if (!curObj[prop]) {
      curObj[prop] = isNum(pathArr[i + 1], true) ? [] : {};
    }

    curObj = curObj[prop] as IterableObj;
  }

  return obj as T;
}
