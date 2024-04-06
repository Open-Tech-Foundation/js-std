import isArr from '../types/isArr';
import has from './has';
import { IterableObj } from './merge';
import toPath from './toPath';

/**
 * Includes all the property paths from the given object for the given list of paths.
 *
 * @example
 *
 * pick({a: 1, b: 2}, 'a') //=> {a: 1}
 */
export default function pick(
  obj: object,
  ...paths: (string | unknown[])[]
): object {
  const outObj = isArr(obj) ? [] : {};

  for (const path of paths) {
    if (has(obj, path)) {
      let curObj = obj;
      let curOutObj = outObj;
      const pathArr = toPath(path);

      for (let i = 0; i < pathArr.length; i++) {
        const prop = pathArr[i] as PropertyKey;

        if (i === pathArr.length - 1) {
          if (isArr(curOutObj)) {
            curOutObj.push((curObj as IterableObj)[prop]);
          } else {
            (curOutObj as IterableObj)[prop] = (curObj as IterableObj)[prop];
          }
          break;
        }

        curObj = (curObj as IterableObj)[prop] as object;

        if (!Object.hasOwn(curOutObj, prop)) {
          (curOutObj as IterableObj)[prop] = isArr(curObj) ? [] : {};
        }

        curOutObj = (curOutObj as IterableObj)[prop] as object;
      }
    }
  }

  return outObj;
}
