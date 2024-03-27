import isArr from '../types/isArr';
import isArrBuf from '../types/isArrBuf';
import isDataView from '../types/isDataView';
import isErr from '../types/isErr';
import isMap from '../types/isMap';
import isObj from '../types/isObj';
import isPureObj from '../types/isPureObj';
import isRegEx from '../types/isRegEx';
import isSet from '../types/isSet';
import isTypedArr, { TypedArray } from '../types/isTypedArr';

interface TypedArrayConstructor {
  new (buf: ArrayBuffer, offset: number, len: number): TypedArray;
}

interface ArrayBufferConstructor {
  new (byteLength: number, options?: { maxByteLength: number }): ArrayBuffer;
}

function cloneObj<T>(obj: T, objRefMap: WeakMap<WeakKey, unknown>): T {
  if (!isPureObj(obj)) {
    return obj;
  }

  if (objRefMap.has(obj as WeakKey)) {
    return objRefMap.get(obj as WeakKey) as T;
  }

  if (isObj(obj)) {
    const cObj: Record<string, unknown> = {};
    objRefMap.set(obj, cObj);

    for (const [k, v] of Object.entries(obj)) {
      cObj[k] = cloneObj(v, objRefMap);
    }

    return cObj as T;
  }

  if (isArr(obj)) {
    const arr = new Array(obj.length);
    objRefMap.set(obj, arr);
    obj.forEach((v, i) => {
      arr[i] = cloneObj(v, objRefMap);
    });

    return arr as T;
  }

  if (obj instanceof Date) {
    const d = new Date(obj);
    objRefMap.set(obj, d);
    return d as T;
  }

  if (isMap(obj)) {
    const map = new Map();
    objRefMap.set(obj, map);

    for (const [key, value] of obj) {
      map.set(cloneObj(key, objRefMap), cloneObj(value, objRefMap));
    }

    return map as T;
  }

  if (isSet(obj)) {
    const set = new Set();
    objRefMap.set(obj, set);

    for (const item of obj) {
      set.add(cloneObj(item, objRefMap));
    }

    return set as T;
  }

  if (isErr(obj)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const c = new obj.constructor();
    c.name = obj.name;
    c.message = obj.message;
    c.stack = obj.stack;
    c.cause = obj.cause;

    return c as T;
  }

  if (isRegEx(obj)) {
    return new RegExp(obj.source, obj.flags) as T;
  }

  if (isArrBuf(obj)) {
    const buff = new (ArrayBuffer as ArrayBufferConstructor)(obj.byteLength, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      maxByteLength: obj.maxByteLength,
    });
    new Uint8Array(buff).set(new Uint8Array(obj));
    return buff as T;
  }

  if (isTypedArr(obj)) {
    const buff = cloneObj(obj.buffer, objRefMap);
    return new (obj.constructor as TypedArrayConstructor)(
      buff,
      obj.byteOffset,
      obj.length
    ) as T;
  }

  if (isDataView(obj)) {
    const buf = cloneObj(obj.buffer, objRefMap);

    return new DataView(buf, obj.byteOffset, obj.byteLength) as T;
  }

  return obj as T;
}

/**
 * It deeply clones the given value
 *
 * @example
 * const obj1 = {a: 1, b: ['x']}
 * const obj2 = clone(obj1)
 * obj1 === obj2 //=> false
 * obj1.b === obj2.b //=> false
 */
export default function clone<T>(val: T): T {
  const objRefMap = new WeakMap();
  return cloneObj(val, objRefMap);
}
