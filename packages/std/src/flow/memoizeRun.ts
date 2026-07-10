import isEql from '../assert/isEql';
import isArrayBuffer from '../types/isArrayBuffer';
import isDataView from '../types/isDataView';
import isError from '../types/isError';
import isMap from '../types/isMap';
import isPlainObject from '../types/isPlainObject';
import isRegExp from '../types/isRegExp';
import isSet from '../types/isSet';
import isTypedArray from '../types/isTypedArray';

type CacheEntry<T, Args extends any[]> = {
  args: Args;
  result: Promise<T>;
  timestamp: number;
};

let nextRefId = 1;
const refIds = new WeakMap<object, number>();
let nextSymbolId = 1;
const symbolIds = new Map<symbol, number>();

function getRefId(value: object): number {
  let id = refIds.get(value);
  if (id === undefined) {
    id = nextRefId++;
    refIds.set(value, id);
  }
  return id;
}

function getSymbolId(value: symbol): number {
  let id = symbolIds.get(value);
  if (id === undefined) {
    id = nextSymbolId++;
    symbolIds.set(value, id);
  }
  return id;
}

function serializeBytes(bytes: Uint8Array): string {
  let out = '';
  for (const byte of bytes) {
    out += byte.toString(16).padStart(2, '0');
  }
  return out;
}

function serializeValue(
  value: unknown,
  seen: Map<object, number>,
): string {
  if (value === null) return 'null';

  switch (typeof value) {
    case 'undefined':
      return 'undefined';
    case 'boolean':
      return `bool:${value}`;
    case 'number':
      if (Number.isNaN(value)) return 'number:NaN';
      if (Object.is(value, -0)) return 'number:-0';
      return `number:${value}`;
    case 'string':
      return `string:${JSON.stringify(value)}`;
    case 'bigint':
      return `bigint:${value.toString()}`;
    case 'symbol':
      return `symbol-ref:${getSymbolId(value)}`;
    case 'function':
      return `function-ref:${getRefId(value)}`;
    case 'object':
      break;
  }

  const obj = value as object;
  const seenId = seen.get(obj);
  if (seenId !== undefined) {
    return `ref:${seenId}`;
  }

  const id = seen.size + 1;
  seen.set(obj, id);

  if (Array.isArray(value)) {
    const items: string[] = [];
    for (let i = 0; i < value.length; i++) {
      if (Object.hasOwn(value, i)) {
        items.push(serializeValue(value[i], seen));
      } else {
        items.push('hole');
      }
    }
    return `array#${id}[${items.join(',')}]`;
  }

  if (isPlainObject(value)) {
    const stringKeys = Object.keys(value).sort();
    const symbolKeys = Object.getOwnPropertySymbols(value).sort((a, b) => {
      return getSymbolId(a) - getSymbolId(b);
    });
    const parts = [
      ...stringKeys.map(
        (key) => `${JSON.stringify(key)}:${serializeValue((value as any)[key], seen)}`,
      ),
      ...symbolKeys.map(
        (key) =>
          `@@symbol:${getSymbolId(key)}:${serializeValue((value as any)[key], seen)}`,
      ),
    ];
    const protoTag = Object.getPrototypeOf(value) === null ? 'nullproto' : 'object';
    return `${protoTag}#${id}{${parts.join(',')}}`;
  }

  if (value instanceof Date) {
    return `date:${value.getTime()}`;
  }

  if (isRegExp(value)) {
    return `regexp:${JSON.stringify(value.source)}/${value.flags}@${value.lastIndex}`;
  }

  if (isMap(value)) {
    const parts = Array.from(value.entries(), ([key, val]) => {
      return `${serializeValue(key, seen)}=>${serializeValue(val, seen)}`;
    });
    return `map#${id}{${parts.join(',')}}`;
  }

  if (isSet(value)) {
    const parts = Array.from(value.values(), (item) => serializeValue(item, seen));
    return `set#${id}[${parts.join(',')}]`;
  }

  if (isArrayBuffer(value)) {
    return `arraybuffer:${serializeBytes(new Uint8Array(value))}`;
  }

  if (isTypedArray(value)) {
    const ctor = value.constructor.name;
    return `${ctor}:${value.byteOffset}:${value.length}:${serializeBytes(
      new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
    )}`;
  }

  if (isDataView(value)) {
    return `dataview:${value.byteOffset}:${value.byteLength}:${serializeBytes(
      new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
    )}`;
  }

  if (isError(value)) {
    const keys = Object.keys(value).sort();
    const extra = keys.map(
      (key) => `${JSON.stringify(key)}:${serializeValue((value as any)[key], seen)}`,
    );
    return `error#${id}{name:${JSON.stringify(value.name)},message:${JSON.stringify(
      value.message,
    )},cause:${serializeValue(value.cause, seen)},${extra.join(',')}}`;
  }

  return `object-ref:${getRefId(obj)}`;
}

/**
 * Caches the results of an asynchronous function.
 * Supports Single Flight (concurrent request de-duplication) and TTL.
 *
 * @example
 * const memoized = memoizeRun(fetchUser, { maxAge: 5000 });
 */
export default function memoizeRun<T, Args extends any[]>(
  func: (...args: Args) => Promise<T>,
  options: {
    maxAge?: number;
    key?: (...args: Args) => string;
  } = {},
) {
  const { maxAge, key: keyFn } = options;
  const cache = new Map<string, CacheEntry<T, Args>[]>();

  const memoized = async (...args: Args): Promise<T> => {
    const key = keyFn
      ? keyFn(...args)
      : serializeValue(args, new Map<object, number>());
    const now = Date.now();
    const bucket = cache.get(key);

    if (bucket) {
      const activeEntries = bucket.filter((entry) => {
        return maxAge === undefined || now - entry.timestamp <= maxAge;
      });

      if (activeEntries.length > 0) {
        cache.set(key, activeEntries);

        for (const entry of activeEntries) {
          if (isEql(entry.args, args)) {
            return entry.result;
          }
        }
      } else {
        cache.delete(key);
      }
    }

    const promise = func(...args);
    const entry: CacheEntry<T, Args> = { args, result: promise, timestamp: now };
    const entries = cache.get(key);
    if (entries) {
      entries.push(entry);
    } else {
      cache.set(key, [entry]);
    }

    try {
      return await promise;
    } catch (error) {
      const current = cache.get(key);
      if (current) {
        const next = current.filter((item) => item !== entry);
        if (next.length > 0) {
          cache.set(key, next);
        } else {
          cache.delete(key);
        }
      }
      throw error;
    }
  };

  memoized.clear = () => {
    cache.clear();
  };

  return memoized;
}
