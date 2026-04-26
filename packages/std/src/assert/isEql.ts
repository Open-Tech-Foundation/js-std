import type { IterableObj } from '../object/merge';
import size from '../object/size';
import isArray from '../types/isArray';
import isArrayBuffer from '../types/isArrayBuffer';
import isDataView from '../types/isDataView';
import isError from '../types/isError';
import isMap from '../types/isMap';
import isPlainObject from '../types/isPlainObject';
import isRegExp from '../types/isRegExp';
import isSet from '../types/isSet';
import isTypedArray from '../types/isTypedArray';

function getMapKeys(map: Map<unknown, unknown>) {
  return Array.from(map.keys());
}

function isEqlVal(
  val1: unknown,
  val2: unknown,
  objRefSet1: WeakSet<WeakKey>,
  objRefSet2: WeakSet<WeakKey>,
): boolean {
  // Handles primitives
  if (Object.is(val1, val2)) {
    return true;
  }

  // For circular refs
  if (objRefSet1.has(val1 as WeakKey) && objRefSet2.has(val2 as WeakKey)) {
    return true;
  }

  // Check both has same type string tag
  if (
    Object.prototype.toString.call(val1) !==
    Object.prototype.toString.call(val2)
  ) {
    return false;
  }

  if (size(val1) !== size(val2)) {
    return false;
  }

  if (isPlainObject(val1) && isPlainObject(val2)) {
    objRefSet1.add(val1 as WeakKey);
    objRefSet2.add(val2 as WeakKey);
  }

  if (isArray(val1)) {
    if (val1.length !== (val2 as unknown[]).length) {
      return false;
    }
    // For sparse arrays
    if (size(Object.keys(val1)) !== size(Object.keys(val2 as IterableObj))) {
      return false;
    }
  }

  if (isArray(val1) || isPlainObject(val1) || isTypedArray(val1)) {
    for (const key of Object.keys(val1)) {
      if (
        !isEqlVal(
          (val1 as IterableObj)[key],
          (val2 as IterableObj)[key],
          objRefSet1,
          objRefSet2,
        )
      ) {
        return false;
      }
    }

    for (const key of Object.getOwnPropertySymbols(val1)) {
      if (
        !isEqlVal(
          (val1 as IterableObj)[key],
          (val2 as IterableObj)[key],
          objRefSet1,
          objRefSet2,
        )
      ) {
        return false;
      }
    }

    return true;
  }

  if (val1 instanceof Date) {
    return Object.is(val1.getTime(), (val2 as Date).getTime());
  }

  if (isMap(val1)) {
    const map1Keys = getMapKeys(val1);
    const map2Keys = getMapKeys(val2 as Map<unknown, unknown>);

    if (!isEqlVal(map1Keys, map2Keys, objRefSet1, objRefSet2)) {
      return false;
    }

    for (const [key, value] of val1) {
      if (
        !isEqlVal(
          value,
          (val2 as Map<unknown, unknown>).get(key),
          objRefSet1,
          objRefSet2,
        )
      ) {
        return false;
      }
    }
    return true;
  }

  if (isSet(val1)) {
    const itVal2 = (val2 as Set<unknown>).values();
    for (const value of val1) {
      if (!isEqlVal(value, itVal2.next().value, objRefSet1, objRefSet2)) {
        return false;
      }
    }
    return true;
  }

  if (isError(val1)) {
    if (
      val1.name === (val2 as Error).name &&
      val1.message === (val2 as Error).message
    ) {
      return true;
    }
  }

  if (isRegExp(val1)) {
    if (
      val1.source === (val2 as RegExp).source &&
      val1.flags === (val2 as RegExp).flags &&
      val1.lastIndex === (val2 as RegExp).lastIndex
    ) {
      return true;
    }
  }

  if (isArrayBuffer(val1)) {
    const ta1 = new Uint8Array(val1);
    const ta2 = new Uint8Array(val2 as ArrayBuffer);

    for (const key of ta1.keys()) {
      if (!isEqlVal(ta1[key], ta2[key], objRefSet1, objRefSet2)) {
        return false;
      }
    }

    return true;
  }

  if (isDataView(val1)) {
    for (let i = 0; i < val1.byteLength; i++) {
      if (
        !isEqlVal(
          val1.getUint8(i),
          (val2 as DataView).getUint8(i),
          objRefSet1,
          objRefSet2,
        )
      ) {
        return false;
      }
    }

    return true;
  }

  return false;
}

/**
 * Checks deeply if the given two values are equivalent.
 *
 * @example
 *
 * isEql({a: [{b: 1}]}, {a: [{b: 1}]}) //=> true
 *
 * isEql(null, undefined) //=> false
 *
 * isEql({a: 1}, {a: 1}, {shallow: true}) //=> true
 */
export default function isEql(
  val1: unknown,
  val2: unknown,
  options?: { shallow?: boolean },
): boolean {
  if (options?.shallow) {
    if (Object.is(val1, val2)) {
      return true;
    }

    if (
      typeof val1 === 'object' &&
      typeof val2 === 'object' &&
      val1 !== null &&
      val2 !== null
    ) {
      if (
        Object.prototype.toString.call(val1) !==
        Object.prototype.toString.call(val2)
      ) {
        return false;
      }

      const keys1 = Object.keys(val1 as object);
      const keys2 = Object.keys(val2 as object);

      if (keys1.length !== keys2.length) {
        return false;
      }

      for (let i = 0; i < keys1.length; i++) {
        if (
          !Object.is(
            (val1 as object)[keys1[i] as keyof typeof val1],
            (val2 as object)[keys2[i] as keyof typeof val2],
          )
        ) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  const objRefSet1 = new WeakSet();
  const objRefSet2 = new WeakSet();

  return isEqlVal(val1, val2, objRefSet1, objRefSet2);
}
