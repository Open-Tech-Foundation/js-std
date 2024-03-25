import has from './has';
import { IterableObj } from './merge';
import toPath from './toPath';

/**
 * Gets the value of an object at the given path.
 *
 * @example
 *
 * get({a: {b: {c: 1}}}, 'a.b.c') //=> 1
 */
export default function get(
  obj: object,
  path: string | unknown[],
  defVal?: unknown
): unknown {
  if (!has(obj, path)) {
    return defVal;
  }

  let curObj = obj;
  const pathArr = toPath(path);
  for (const prop of pathArr) {
    curObj = (curObj as IterableObj)[prop as PropertyKey] as object;
  }

  return curObj;
}
