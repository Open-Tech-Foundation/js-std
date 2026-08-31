/**
 * Renders a value the way the documentation writes one.
 *
 * Results cross back from the worker as text, not as values: a structured
 * clone cannot carry a function, a symbol, or a circular graph, and every one
 * of those turns up in these examples. Formatting therefore happens next to the
 * value, and the panel only ever displays a string.
 *
 * The output deliberately matches the `//=>` comments — single quotes, a space
 * after each comma, unpadded array brackets, `Map(2) { 'a' => 1 }` — so a
 * reader comparing the two sees the same notation on both sides.
 */

const MAX_DEPTH = 4;
const MAX_ENTRIES = 100;
const MAX_STRING = 10_000;

const ESCAPES = {
  '\n': '\\n',
  '\t': '\\t',
  '\r': '\\r',
  '\\': '\\\\',
  "'": "\\'",
};

function quote(str) {
  const body = str.replace(/[\n\t\r\\']/g, (c) => ESCAPES[c]);
  return `'${body}'`;
}

/** Keys that need quoting; a bare identifier is written without them. */
function key(name) {
  return /^[A-Za-z_$][\w$]*$/.test(name) ? name : quote(name);
}

function fnLabel(value) {
  const name = value.name || '(anonymous)';
  const isClass = /^class[\s{]/.test(Function.prototype.toString.call(value));
  return isClass ? `[class ${name}]` : `[Function: ${name}]`;
}

/**
 * The constructor name to print before an object's braces.
 *
 * A plain object gets nothing, matching `{ a: 1 }` in the docs, while an
 * instance is worth naming — `clone` returning a `Box` rather than a bare
 * object is the whole point of that example.
 */
function tag(value) {
  const proto = Object.getPrototypeOf(value);
  if (proto === Object.prototype || proto === null) return '';
  const name = proto.constructor?.name;
  return name && name !== 'Object' ? `${name} ` : '';
}

export default function inspect(value, depth = 0, seen = new WeakSet()) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  switch (typeof value) {
    case 'string':
      return quote(
        value.length > MAX_STRING ? `${value.slice(0, MAX_STRING)}…` : value,
      );
    case 'number':
      // `-0` prints as `0` through String(), losing the distinction the
      // library's own equality helpers are careful to keep.
      return Object.is(value, -0) ? '-0' : String(value);
    case 'bigint':
      return `${value}n`;
    case 'boolean':
      return String(value);
    case 'symbol':
      return value.toString();
    case 'function':
      return fnLabel(value);
  }

  if (seen.has(value)) return '[Circular]';
  if (depth > MAX_DEPTH) return Array.isArray(value) ? '[Array]' : '[Object]';

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString();
  }
  if (value instanceof RegExp) return String(value);
  if (value instanceof Error) {
    return value.message ? `${value.name}: ${value.message}` : value.name;
  }
  if (value instanceof Promise) return 'Promise { <pending> }';
  if (value instanceof ArrayBuffer) return `ArrayBuffer(${value.byteLength})`;

  seen.add(value);
  try {
    const next = depth + 1;

    if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
      const items = [...value].slice(0, MAX_ENTRIES).map(String);
      return `${value.constructor.name}(${value.length}) [${items.join(', ')}]`;
    }

    if (Array.isArray(value)) {
      const items = value
        .slice(0, MAX_ENTRIES)
        .map((v) => inspect(v, next, seen));
      if (value.length > MAX_ENTRIES) {
        items.push(`… ${value.length - MAX_ENTRIES} more`);
      }
      return items.length ? `[${items.join(', ')}]` : '[]';
    }

    if (value instanceof Map) {
      const items = [];
      for (const [k, v] of value) {
        if (items.length === MAX_ENTRIES) break;
        items.push(`${inspect(k, next, seen)} => ${inspect(v, next, seen)}`);
      }
      const body = items.length ? `{ ${items.join(', ')} }` : '{}';
      return `Map(${value.size}) ${body}`;
    }

    if (value instanceof Set) {
      const items = [];
      for (const v of value) {
        if (items.length === MAX_ENTRIES) break;
        items.push(inspect(v, next, seen));
      }
      const body = items.length ? `{ ${items.join(', ')} }` : '{}';
      return `Set(${value.size}) ${body}`;
    }

    const entries = Object.entries(value)
      .slice(0, MAX_ENTRIES)
      .map(([k, v]) => `${key(k)}: ${inspect(v, next, seen)}`);

    // A class instance with no own enumerable keys still deserves its name.
    const label = tag(value);
    if (!entries.length) return label ? `${label}{}` : '{}';
    return `${label}{ ${entries.join(', ')} }`;
  } finally {
    seen.delete(value);
  }
}
