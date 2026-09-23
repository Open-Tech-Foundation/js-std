/**
 * Serializes an object to a URL query string in `qs` bracket notation.
 *
 * This is the inverse of `parseQueryString`: nested objects become `user[name]`
 * segments, arrays become repeated `tags[]` pairs, and a round trip preserves
 * the shape for string leaves — numbers and booleans come back as strings,
 * because a query string is text. Keys and leaves are
 * percent-encoded with `encodeURIComponent`, so spaces become `%20` and a
 * literal `+` survives as `%2B` rather than reading back as a space.
 *
 * Leaves that are not strings are coerced the unsurprising way: numbers and
 * booleans stringify, a `Date` becomes its ISO string, `null` keeps its key
 * with an empty value, and `undefined` — like an empty object or array — is
 * skipped outright. Anything else that is not a plain value (functions,
 * symbols) is skipped the same way rather than throwing on data.
 *
 * @param {object} obj The object to serialize. Must be a non-array object.
 * @returns {string} The query string, without a leading `?`.
 * @throws {TypeError} If `obj` is not a non-array object, or if it is circular.
 *
 * @example
 * stringifyQueryString({ name: 'Ada', tags: ['a', 'b'], user: { name: 'x' } })
 * //=> 'name=Ada&tags[]=a&tags[]=b&user[name]=x'
 */
export default function stringifyQueryString(obj: object): string {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new TypeError('stringifyQueryString: expected a plain object.');
  }

  const parts: string[] = [];
  const seen: object[] = [obj];
  for (const key of Object.keys(obj)) {
    append(
      parts,
      seen,
      encodeURIComponent(key),
      (obj as Record<string, unknown>)[key],
    );
  }
  seen.pop();
  return parts.join('&');
}

/** Serializes one already-encoded key and its value. */
function append(
  parts: string[],
  seen: object[],
  key: string,
  value: unknown,
): void {
  if (value === undefined) return;
  if (value === null) {
    parts.push(`${key}=`);
    return;
  }
  if (value instanceof Date) {
    parts.push(`${key}=${encodeURIComponent(value.toISOString())}`);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) append(parts, seen, `${key}[]`, item);
    return;
  }
  if (typeof value === 'object') {
    if (seen.includes(value)) {
      throw new TypeError('stringifyQueryString: circular structure.');
    }
    seen.push(value);
    for (const k of Object.keys(value)) {
      append(
        parts,
        seen,
        `${key}[${encodeURIComponent(k)}]`,
        (value as Record<string, unknown>)[k],
      );
    }
    seen.pop();
    return;
  }
  if (typeof value === 'function' || typeof value === 'symbol') return;
  parts.push(`${key}=${encodeURIComponent(String(value))}`);
}
