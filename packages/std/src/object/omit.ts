import remove from '../array/remove';
import isArray from '../types/isArray';
import clone from './clone';
import type { IterableObj } from './merge';
import toPath from './toPath';

function walk(
  obj: object,
  path: string | unknown[],
  cb: (obj: object, prop: PropertyKey) => void,
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
export default function omit(
  obj: object,
  ...paths: (string | unknown[])[]
): object {
  let c = clone(obj);
  const arrPathSet = new Set<string | unknown[]>();

  for (const path of paths) {
    walk(c, path, (obj, prop) => {
      if (isArray(obj)) {
        arrPathSet.add(path);
      }

      delete (obj as IterableObj)[prop];
    });
  }

  for (const path of arrPathSet) {
    if ((path as unknown[]).length === 1) {
      c = (c as []).flat();
      continue;
    }

    const pathArr = toPath(path);
    walk(c, remove(pathArr), (obj, prop) => {
      (obj as IterableObj)[prop] = ((obj as IterableObj)[prop] as []).flat();
    });
  }

  return c;
}
