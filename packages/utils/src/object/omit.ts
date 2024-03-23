import arrRm from '../array/arrRm';
import isArr from '../types/isArr';
import clone from './clone';
import { IterableObj } from './merge';
import toPath from './toPath';

function walk(
  obj: object,
  path: string | unknown[],
  cb: (obj: object, prop: PropertyKey) => void
) {
  let curObj = obj;
  const pathArr = toPath(path);

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as PropertyKey;

    if (!Object.hasOwn(curObj, prop)) {
      break;
    }

    if (i === pathArr.length - 1) {
      cb(curObj, prop);
    }

    curObj = (curObj as IterableObj)[prop] as object;
  }
}

/**
 * Removes all the property paths from the given object for the given list of paths.
 *
 * @example
 *
 * omit({a: 1, b: 2}, 'a') //=> {b: 2}
 */
export default function omit(obj: object, ...paths: (string | unknown[])[]) {
  let c = clone(obj);
  const arrPathSet = new Set();

  for (const path of paths) {
    walk(c, path, (obj, prop) => {
      if (isArr(obj)) {
        arrPathSet.add(path);
      }

      delete (obj as IterableObj)[prop];
    });
  }

  arrPathSet.forEach((path) => {
    if ((path as unknown[]).length === 1) {
      c = (c as []).flat();
      return;
    }

    const pathArr = toPath(path);
    walk(c, arrRm(pathArr), (obj, prop) => {
      (obj as IterableObj)[prop] = ((obj as IterableObj)[prop] as []).flat();
    });
  });

  return c;
}
