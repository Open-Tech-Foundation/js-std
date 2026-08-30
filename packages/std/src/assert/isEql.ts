import { checkDepth } from '../object/maxDepth';
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

function getEnumerableOwnKeys(value: object): (string | symbol)[] {
  return [...Object.keys(value), ...Object.getOwnPropertySymbols(value)];
}

function hasOwnKey(value: object, key: string | symbol): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isObjectLike(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

/**
 * The pairs already being compared further up the walk.
 *
 * A cycle is only a cycle if the *same two* values come round again together,
 * so the record has to be of pairs rather than of each side separately. Two
 * sets, one per side, called it a cycle as soon as each value had been seen
 * anywhere in its own graph, which is true of structures that merely share a
 * node and are not equal at all.
 */
type PairSet = WeakMap<WeakKey, WeakSet<WeakKey>>;

function hasPair(seen: PairSet, val1: WeakKey, val2: WeakKey): boolean {
  return seen.get(val1)?.has(val2) ?? false;
}

function addPair(seen: PairSet, val1: WeakKey, val2: WeakKey): void {
  const paired = seen.get(val1);

  if (paired) {
    paired.add(val2);
    return;
  }

  seen.set(val1, new WeakSet<WeakKey>([val2]));
}

function isEqlVal(
  val1: unknown,
  val2: unknown,
  seen: PairSet,
  depth = 0,
): boolean {
  checkDepth(depth, 'isEql');

  // Handles primitives
  if (Object.is(val1, val2)) {
    return true;
  }

  // For circular refs. Reaching a pair that is already open above us means the
  // walk has come round a cycle; the pair is equal exactly if everything else
  // about it is, which the frames still open are in the middle of deciding.
  if (
    isObjectLike(val1) &&
    isObjectLike(val2) &&
    hasPair(seen, val1 as WeakKey, val2 as WeakKey)
  ) {
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

  // Every container is recorded, not only plain objects: an array, a Map or a
  // Set can hold itself just as easily, and those cycles used to run until the
  // depth cap threw instead of comparing as equal.
  if (isObjectLike(val1) && isObjectLike(val2)) {
    addPair(seen, val1 as WeakKey, val2 as WeakKey);
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
    if (
      getEnumerableOwnKeys(val1).length !==
      getEnumerableOwnKeys(val2 as object).length
    ) {
      return false;
    }

    for (const key of Object.keys(val1)) {
      if (
        !isEqlVal(
          (val1 as IterableObj)[key],
          (val2 as IterableObj)[key],
          seen,
          depth + 1,
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
          seen,
          depth + 1,
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
    const entries1 = Array.from(val1.entries());
    const entries2 = Array.from((val2 as Map<unknown, unknown>).entries());

    if (entries1.length !== entries2.length) {
      return false;
    }

    for (let i = 0; i < entries1.length; i++) {
      const [key1, value1] = entries1[i];
      const [key2, value2] = entries2[i];

      if (
        !isEqlVal(key1, key2, seen, depth + 1) ||
        !isEqlVal(value1, value2, seen, depth + 1)
      ) {
        return false;
      }
    }
    return true;
  }

  if (isSet(val1)) {
    const itVal2 = (val2 as Set<unknown>).values();
    for (const value of val1) {
      if (!isEqlVal(value, itVal2.next().value, seen, depth + 1)) {
        return false;
      }
    }
    return true;
  }

  if (isError(val1)) {
    const err2 = val2 as Error;
    if (val1.name !== err2.name || val1.message !== err2.message) {
      return false;
    }

    if (!isEqlVal(val1.cause, err2.cause, seen, depth + 1)) {
      return false;
    }

    const keys1 = Object.keys(val1);
    const keys2 = Object.keys(err2);
    const symKeys1 = Object.getOwnPropertySymbols(val1);
    const symKeys2 = Object.getOwnPropertySymbols(err2);

    if (keys1.length !== keys2.length || symKeys1.length !== symKeys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!isEqlVal((val1 as any)[key], (val2 as any)[key], seen, depth + 1)) {
        return false;
      }
    }

    for (const key of symKeys1) {
      if (!hasOwnKey(err2, key)) {
        return false;
      }

      if (!isEqlVal((val1 as any)[key], (val2 as any)[key], seen, depth + 1)) {
        return false;
      }
    }

    return true;
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
      if (!isEqlVal(ta1[key], ta2[key], seen, depth + 1)) {
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
          seen,
          depth + 1,
        )
      ) {
        return false;
      }
    }

    return true;
  }

  return false;
}

export interface IsEqlOptions {
  /** Compare only the first level, leaving nested values to `Object.is`. */
  shallow?: boolean;
}

/**
 * Checks deeply if the given two values are equivalent.
 *
 * @param {unknown} val1 The first value to compare.
 * @param {unknown} val2 The second value to compare.
 * @param {Object} [options] The options object.
 * @returns {boolean} True if values are equivalent, false otherwise.
 *
 * @example
 * isEql({a: [{b: 1}]}, {a: [{b: 1}]}) //=> true
 * isEql(null, undefined) //=> false
 */
export default function isEql(
  val1: unknown,
  val2: unknown,
  options?: IsEqlOptions,
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
      const symbolKeys1 = Object.getOwnPropertySymbols(val1);
      const symbolKeys2 = Object.getOwnPropertySymbols(val2);

      if (
        keys1.length !== keys2.length ||
        symbolKeys1.length !== symbolKeys2.length
      ) {
        return false;
      }

      for (const key of keys1) {
        if (!hasOwnKey(val2, key)) {
          return false;
        }

        if (
          !Object.is(
            (val1 as Record<string | symbol, unknown>)[key],
            (val2 as Record<string | symbol, unknown>)[key],
          )
        ) {
          return false;
        }
      }

      for (const key of symbolKeys1) {
        if (!hasOwnKey(val2, key)) {
          return false;
        }

        if (
          !Object.is(
            (val1 as Record<string | symbol, unknown>)[key],
            (val2 as Record<string | symbol, unknown>)[key],
          )
        ) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  return isEqlVal(val1, val2, new WeakMap(), 0);
}
