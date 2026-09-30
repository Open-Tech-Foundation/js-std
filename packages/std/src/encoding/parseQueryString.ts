import { hasUnsafeKey } from '../object/isUnsafeKey';
import { MAX_ARRAY_INDEX } from '../object/set';

/**
 * The deepest bracket nesting a query key may open.
 *
 * Past this point the remaining segments collapse into one literal key, the
 * way `qs` folds its own overflow: depth exists to bound what untrusted input
 * can build, and five levels hold every real query shape. Only nesting counts
 * — a flat `a=1&b=2&c=3` never comes near it no matter how many pairs arrive.
 */
const MAX_QUERY_DEPTH = 5;

/**
 * Parses a URL query string into an object, following `qs` bracket notation.
 *
 * A leading `?` is accepted and a trailing `#fragment` is ignored, so the
 * value can be lifted straight from a location or a request target. Pairs
 * split on `&` and on the first `=`; a key with no `=` means an empty value,
 * and `+` reads as a space before percent-decoding. A segment that fails to
 * percent-decode is kept raw rather than throwing — bad data must not fail
 * the parse of good data.
 *
 * Nesting follows brackets only; dots stay literal, matching `qs` rather
 * than `toPath`. `user[name]=Ada` nests, `tags[]=a&tags[]=b` appends, and a
 * key repeated without brackets collects into an array, so `a=1&a=2` reads
 * as `{ a: ['1', '2'] }` instead of losing the first value the way
 * `Object.fromEntries(new URLSearchParams(query))` does.
 *
 * Untrusted input stays cheap and safe: nesting deeper than `MAX_QUERY_DEPTH`
 * folds into a literal key, a numeric segment past `MAX_ARRAY_INDEX` becomes
 * a plain object key instead of a hundred-million-long array, and a key
 * touching `__proto__`, `constructor` or `prototype` is dropped whole — the
 * same refusal `set` and `unflattenObject` apply.
 *
 * @param {string} query The query string to parse, with or without a leading `?`.
 * @returns {Record<string, unknown>} The parsed pairs, nested by brackets.
 * @throws {TypeError} If `query` is not a string.
 *
 * @example
 * parseQueryString('?name=Ada&tags[]=a&tags[]=b&user[name]=x')
 * //=> { name: 'Ada', tags: ['a', 'b'], user: { name: 'x' } }
 *
 * @example
 * parseQueryString('a=1&a=2') //=> { a: ['1', '2'] }
 */
export default function parseQueryString(
  query: string,
): Record<string, unknown> {
  if (typeof query !== 'string') {
    throw new TypeError('parseQueryString: expected a query string.');
  }

  const out: Record<string, unknown> = {};
  let rest = query.startsWith('?') ? query.slice(1) : query;
  const hash = rest.indexOf('#');
  if (hash !== -1) rest = rest.slice(0, hash);
  if (rest === '') return out;

  for (const pair of rest.split('&')) {
    if (pair === '') continue;
    const eq = pair.indexOf('=');
    const rawSegments = splitKey(eq === -1 ? pair : pair.slice(0, eq));
    const segments = rawSegments.map(decode);
    if (hasUnsafeKey(segments)) continue;
    assign(out, segments, decode(eq === -1 ? '' : pair.slice(eq + 1)), 0);
  }

  return out;
}

/** Percent-decodes a form-encoded segment, keeping undecodable input raw. */
function decode(segment: string): string {
  try {
    return decodeURIComponent(segment.replace(/\+/g, ' '));
  } catch {
    return segment;
  }
}

/**
 * Splits a key into bracket segments: `user[name]` is `['user', 'name']`
 * and `tags[]` is `['tags', '']`, where the empty segment means append.
 * Dots are never split. A key whose brackets do not balance stays one
 * literal segment, so malformed input loses nothing and crashes nothing.
 */
function splitKey(key: string): string[] {
  const open = key.indexOf('[');
  if (open === -1) return [key];

  const head = key.slice(0, open);
  const tail = key.slice(open);
  if (!/^(?:\[[^\][]*\])+$/.test(tail)) return [key];

  const segments = [head];
  for (const m of tail.matchAll(/\[([^\][]*)\]/g)) segments.push(m[1]);
  return segments;
}

/** A numeric segment is an array index only when it can be one. */
function toIndex(segment: string): number {
  if (!/^(0|[1-9]\d*)$/.test(segment)) return -1;
  const index = Number(segment);
  return index <= MAX_ARRAY_INDEX ? index : -1;
}

/**
 * Writes one value down a segment path, collecting repeats and appends.
 *
 * A leaf that already holds a value collects: the second arrival turns the
 * slot into an array rather than overwriting the first. `[]` appends a fresh
 * slot (or reuses the array a repeat already built), a numeric segment
 * addresses an array, and anything else opens a plain object. A scalar in
 * the way of a branch is replaced — the later pair wins, the way `qs`
 * resolves the same conflict.
 */
function assign(
  holder: Record<string, unknown> | unknown[],
  segments: string[],
  value: string,
  depth: number,
): void {
  const [segment, ...rest] = segments;

  if (rest.length === 0) {
    const hasCurrent = Object.prototype.hasOwnProperty.call(holder, segment);
    const current = hasCurrent
      ? (holder as Record<string, unknown>)[segment]
      : undefined;
    if (
      current === undefined ||
      (typeof current === 'object' &&
        current !== null &&
        !Array.isArray(current))
    ) {
      // A fresh slot — or a branch in the way of a scalar, which the later
      // pair wins the way `qs` resolves the same conflict.
      (holder as Record<string, unknown>)[segment] = value;
    } else if (Array.isArray(current)) {
      current.push(value);
    } else {
      (holder as Record<string, unknown>)[segment] = [current, value];
    }
    return;
  }

  if (depth >= MAX_QUERY_DEPTH) {
    const literal = segment + rest.map((s) => `[${s}]`).join('');
    assign(holder, [literal], value, depth);
    return;
  }

  const [next, ...after] = rest;
  if (next === '') {
    let list = (holder as Record<string, unknown>)[segment];
    if (!Array.isArray(list)) {
      list = list === undefined ? [] : [list];
      (holder as Record<string, unknown>)[segment] = list;
    }
    if (after.length === 0) {
      (list as unknown[]).push(value);
      return;
    }
    const slot: Record<string, unknown> = {};
    (list as unknown[]).push(slot);
    assign(slot, after, value, depth + 1);
    return;
  }

  let child = (holder as Record<string, unknown>)[segment];
  if (child === undefined || typeof child !== 'object' || child === null) {
    child = toIndex(next) === -1 ? {} : [];
    (holder as Record<string, unknown>)[segment] = child;
  }
  assign(child as Record<string, unknown>, rest, value, depth + 1);
}
