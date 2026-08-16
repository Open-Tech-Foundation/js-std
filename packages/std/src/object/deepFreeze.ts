import isDataView from '../types/isDataView';
import isTypedArray from '../types/isTypedArray';
import { checkDepth } from './maxDepth';

/**
 * Every property of `T` made readonly, recursively.
 *
 * `Map`, `Set`, `Date`, `RegExp`, `Promise` and functions are left as they are
 * rather than being reported as readonly. `Object.freeze` cannot stop
 * `map.set()` or `date.setTime()`, and a type saying otherwise would be a
 * promise the runtime does not keep.
 */
export type DeepReadonly<T> = T extends
  | ((...args: never[]) => unknown)
  | Date
  | RegExp
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | Promise<unknown>
  ? T
  : T extends readonly (infer U)[]
    ? readonly DeepReadonly<U>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

function freeze(val: unknown, seen: WeakSet<WeakKey>, depth = 0): void {
  checkDepth(depth, 'deepFreeze');

  if (val === null || (typeof val !== 'object' && typeof val !== 'function')) {
    return;
  }

  if (seen.has(val as WeakKey)) {
    return;
  }
  seen.add(val as WeakKey);

  // `Object.freeze` throws on a non-empty typed array — its elements live in a
  // buffer and cannot be made non-configurable. Nothing here is reachable
  // through properties either, so there is nothing to walk.
  if (isTypedArray(val) || isDataView(val)) {
    return;
  }

  // Freeze before recursing, so a cycle reached through this value finds it
  // already done rather than running forever.
  Object.freeze(val);

  for (const key of Reflect.ownKeys(val as object)) {
    const desc = Object.getOwnPropertyDescriptor(val, key);

    // Reading an accessor would run it, and a getter is free to have effects or
    // to build a fresh object every call — one nothing else holds a reference
    // to, making it pointless to freeze.
    if (desc && 'value' in desc) {
      freeze(desc.value, seen, depth + 1);
    }
  }

  if (val instanceof Map) {
    for (const [k, v] of val) {
      freeze(k, seen, depth + 1);
      freeze(v, seen, depth + 1);
    }
  } else if (val instanceof Set) {
    for (const v of val) {
      freeze(v, seen, depth + 1);
    }
  }
}

/**
 * Recursively freezes an object and everything reachable from it.
 *
 * `Object.freeze` is shallow — it seals the object it is given and leaves every
 * nested object it holds writable, so a configuration or a fixture frozen with
 * it is only frozen one level down. This walks the whole graph.
 *
 * Reached are own properties, array elements, and the keys and values of a
 * `Map` or `Set`. Both string and symbol keys are followed. Accessor properties
 * are not: reading one would run it, which a getter is free to treat as an
 * event or to answer with a fresh object nothing else holds.
 *
 * Cycles are handled, and a shared object reached twice is frozen once.
 *
 * A `Map` or `Set` is itself frozen, which stops properties being added to it
 * but not `set`, `add` or `delete` — its entries live in internal slots that no
 * JavaScript mechanism can seal. The same is true of `Date`. Their contents are
 * frozen; the containers cannot be.
 *
 * Typed arrays and `DataView`s are skipped rather than frozen. `Object.freeze`
 * throws on a non-empty one, since its elements sit in a buffer that cannot be
 * made non-configurable, so passing a structure holding binary data neither
 * fails nor silently protects it.
 *
 * The object is frozen in place and returned, so the argument and the result
 * are the same object. Freezing is permanent: there is no thaw.
 *
 * @param {T} val The value to freeze.
 * @returns {DeepReadonly<T>} The same value, deeply frozen.
 *
 * @example
 * const config = deepFreeze({ db: { port: 5432 } });
 * config.db.port = 1; //=> ignored, or TypeError in strict mode
 *
 * @example
 * deepFreeze([{ a: 1 }]);
 * //=> the array and the object inside it are both frozen
 */
export default function deepFreeze<T>(val: T): DeepReadonly<T> {
  freeze(val, new WeakSet());

  return val as DeepReadonly<T>;
}
