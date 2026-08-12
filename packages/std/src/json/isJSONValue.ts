import type { JsonValue } from './JsonValue';

/**
 * Checks whether `val` is a valid JSON value — the values `JSON.stringify`
 * can represent without loss: `string`, finite `number`, `boolean`, `null`,
 * arrays of JSON values, and plain objects with JSON values.
 *
 * `NaN`, `Infinity`, `-Infinity`, `bigint`, `undefined`, `function`, `symbol`,
 * `Date`, `Map`, `Set`, etc. are not JSON values. `Date` stringifies via
 * `toJSON` but is not itself a `JsonValue`. Cyclic values return `false`
 * rather than throwing; shared (diamond) references are allowed.
 *
 * @example
 * isJSONValue({a:1}) //=> true
 * isJSONValue([1, "a", null]) //=> true
 * isJSONValue(BigInt(1)) //=> false
 * isJSONValue(NaN) //=> false
 * isJSONValue({a: undefined}) //=> false
 */
export default function isJSONValue(val: unknown): val is JsonValue {
  return isJSONValueInternal(val, new WeakSet());
}

function isJSONValueInternal(
  val: unknown,
  seen: WeakSet<object>,
): val is JsonValue {
  if (val === null) return true;

  const t = typeof val;

  if (t === 'string' || t === 'boolean') return true;

  if (t === 'number') return Number.isFinite(val as number);

  if (Array.isArray(val)) {
    if (seen.has(val as object)) return false;
    seen.add(val as object);
    for (const item of val as unknown[]) {
      if (!isJSONValueInternal(item, seen)) {
        seen.delete(val as object);
        return false;
      }
    }
    seen.delete(val as object);
    return true;
  }

  if (t === 'object') {
    const obj = val as object;
    if (seen.has(obj)) return false;

    const proto = Object.getPrototypeOf(val);
    if (proto !== Object.prototype && proto !== null) return false;

    if (Object.getOwnPropertySymbols(obj).length > 0) return false;

    seen.add(obj);
    for (const key of Object.keys(val as Record<string, unknown>)) {
      if (!isJSONValueInternal((val as Record<string, unknown>)[key], seen)) {
        seen.delete(obj);
        return false;
      }
    }
    seen.delete(obj);
    return true;
  }

  return false;
}
