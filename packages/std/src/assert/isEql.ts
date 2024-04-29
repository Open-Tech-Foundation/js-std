import { IterableObj } from '../object/merge';
import size from '../object/size';
import isArr from '../types/isArr';
import isArrBuf from '../types/isArrBuf';
import isDataView from '../types/isDataView';
import isErr from '../types/isErr';
import isMap from '../types/isMap';
import isObj from '../types/isObj';
import isPureObj from '../types/isPureObj';
import isRegEx from '../types/isRegEx';
import isSet from '../types/isSet';
import isTypedArr from '../types/isTypedArr';

function getMapKeys(map: Map<unknown, unknown>) {
  const arr = [];

  for (const key of map.keys()) {
    arr.push(key);
  }

  return arr;
}

function isEqlVal(
  val1: unknown,
  val2: unknown,
  objRefSet1: WeakSet<WeakKey>,
  objRefSet2: WeakSet<WeakKey>
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
  if (typeof val1 !== typeof val2) {
    return false;
  }

  if (size(val1) !== size(val2)) {
    return false;
  }

  if (isPureObj(val1) && isPureObj(val2)) {
    objRefSet1.add(val1 as WeakKey);
    objRefSet2.add(val2 as WeakKey);
  }

  if (isArr(val1)) {
    // For sparse arrays
    if (size(Object.keys(val1)) !== size(Object.keys(val2 as IterableObj))) {
      return false;
    }
  }

  if (isArr(val1) || isObj(val1) || isTypedArr(val1)) {
    for (const key of Object.keys(val1)) {
      if (
        !isEqlVal(
          (val1 as IterableObj)[key],
          (val2 as IterableObj)[key],
          objRefSet1,
          objRefSet2
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
          objRefSet2
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
          objRefSet2
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

  if (isErr(val1)) {
    if (
      val1.name === (val2 as Error).name &&
      val1.message === (val2 as Error).message
    ) {
      return true;
    }
  }

  if (isRegEx(val1)) {
    if (
      val1.source === (val2 as RegExp).source &&
      val1.flags === (val2 as RegExp).flags &&
      val1.lastIndex === (val2 as RegExp).lastIndex
    ) {
      return true;
    }
  }

  if (isArrBuf(val1)) {
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
          objRefSet2
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
 */
export default function isEql(val1: unknown, val2: unknown): boolean {
  const objRefSet1 = new WeakSet();
  const objRefSet2 = new WeakSet();

  return isEqlVal(val1, val2, objRefSet1, objRefSet2);
}
