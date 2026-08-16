import isUnsafeKey from './isUnsafeKey';

/**
 * Copies the own enumerable keys of `source` onto `target`, skipping the keys
 * that would reach the prototype.
 *
 * A drop-in for `Object.assign` wherever the source is not trusted. The two
 * differ only on unsafe keys, and `Object.assign` is the wrong tool there: it
 * copies through `[[Set]]`, so an own `__proto__` key on the source — exactly
 * what `JSON.parse` produces for `{"__proto__":{...}}` — runs the accessor on
 * `Object.prototype` and replaces the target's prototype instead of adding a
 * property to it. Nothing about the result looks wrong afterwards: the key is
 * absent from `Object.keys` and from `JSON.stringify`, while every inherited
 * value reads back through the target.
 *
 * Symbol keys are copied as they are, being unable to name an unsafe key.
 */
export default function safeAssign<T extends object>(
  target: T,
  source: unknown,
): T {
  if (source === null || source === undefined) {
    return target;
  }

  const obj = Object(source) as Record<PropertyKey, unknown>;

  for (const key of Object.keys(obj)) {
    if (isUnsafeKey(key)) {
      continue;
    }

    (target as Record<PropertyKey, unknown>)[key] = obj[key];
  }

  for (const sym of Object.getOwnPropertySymbols(obj)) {
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
      continue;
    }

    (target as Record<PropertyKey, unknown>)[sym] = obj[sym];
  }

  return target;
}
