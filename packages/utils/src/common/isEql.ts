import size from '../object/size';
import isArr from '../types/isArr';
import isMap from '../types/isMap';
import isObj from '../types/isObj';
import isSet from '../types/isSet';
import isTypedArr from '../types/isTypedArr';

function getMapKeys(map: Map<unknown, unknown>) {
  const arr = [];

  for (const key of map.keys()) {
    arr.push(key);
  }

  return arr;
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
function isEqlVal(
  val1: unknown,
  val2: unknown,
  objRefSet1: WeakSet<WeakKey>,
  objRefSet2: WeakSet<WeakKey>
): boolean {
  if (Object.is(val1, val2)) {
    return true;
  }

  if (objRefSet1.has(val1) && objRefSet2.has(val2)) {
    return true;
  }

  if (
    Object.prototype.toString.call(val1) !==
    Object.prototype.toString.call(val2)
  ) {
    return false;
  }

  if (size(val1) !== size(val2)) {
    return false;
  }

  if (isArr(val1) || isObj(val1) || isTypedArr(val1)) {
    objRefSet1.add(val1);
    objRefSet2.add(val2);
    for (const key of Object.keys(val1)) {
      if (!isEqlVal(val1[key], val2[key], objRefSet1, objRefSet2)) {
        return false;
      }
    }

    return true;
  }

  if (val1 instanceof Date) {
    return Object.is(val1.getTime(), val2.getTime());
  }

  if (isMap(val1)) {
    const map1Keys = getMapKeys(val1);
    const map2Keys = getMapKeys(val2);

    if (!isEqlVal(map1Keys, map2Keys, objRefSet1, objRefSet2)) {
      return false;
    }

    for (const [key, value] of val1) {
      if (!isEqlVal(value, val2.get(key), objRefSet1, objRefSet2)) {
        return false;
      }
    }
    return true;
  }

  if (isSet(val1)) {
    const itVal2 = val2.values();
    for (const value of val1) {
      if (!isEqlVal(value, itVal2.next().value, objRefSet1, objRefSet2)) {
        return false;
      }
    }
    return true;
  }

  return false;
}

export default function isEql(val1: unknown, val2: unknown): boolean {
  const objRefSet1 = new WeakSet();
  const objRefSet2 = new WeakSet();

  return isEqlVal(val1, val2, objRefSet1, objRefSet2);
}
