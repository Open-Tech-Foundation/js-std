import isArray from '../types/isArray';
import isArrayBuffer from '../types/isArrayBuffer';
import isDataView from '../types/isDataView';
import isError from '../types/isError';
import isMap from '../types/isMap';
import isObject from '../types/isObject';
import isPlainObject from '../types/isPlainObject';
import isRegExp from '../types/isRegExp';
import isSet from '../types/isSet';
import isTypedArray, { type TypedArray } from '../types/isTypedArray';

interface TypedArrayConstructor {
  new (buf: ArrayBufferLike, offset: number, len: number): TypedArray;
}

interface ArrayBufferConstructor {
  new (byteLength: number, options?: { maxByteLength: number }): ArrayBuffer;
}

function cloneObj<T>(obj: T, objRefMap: WeakMap<WeakKey, unknown>): T {
  if (!isObject(obj)) {
    return obj;
  }

  if (objRefMap.has(obj as WeakKey)) {
    return objRefMap.get(obj as WeakKey) as T;
  }

  if (isPlainObject(obj)) {
    const cObj: Record<string, unknown> = {};
    objRefMap.set(obj, cObj);

    for (const [k, v] of Object.entries(obj)) {
      cObj[k] = cloneObj(v, objRefMap);
    }

    return cObj as T;
  }

  if (isArray(obj)) {
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

  if (isError(obj)) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const c = new (obj.constructor as any)(obj.message);
    if (obj.name !== c.name) {
      c.name = obj.name;
    }
    c.stack = obj.stack;
    c.cause = obj.cause;

    return c as T;
  }

  if (isRegExp(obj)) {
    return new RegExp(obj.source, obj.flags) as T;
  }

  if (isArrayBuffer(obj)) {
    const buff = new (ArrayBuffer as ArrayBufferConstructor)(obj.byteLength, {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      maxByteLength: (obj as any).maxByteLength,
    });
    new Uint8Array(buff).set(new Uint8Array(obj as ArrayBuffer));
    return buff as T;
  }

  if (isTypedArray(obj)) {
    const buff = cloneObj(obj.buffer, objRefMap) as ArrayBufferLike;
    return new (obj.constructor as TypedArrayConstructor)(
      buff,
      obj.byteOffset,
      obj.length,
    ) as T;
  }

  if (isDataView(obj)) {
    const buf = cloneObj(obj.buffer, objRefMap) as ArrayBufferLike;

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
