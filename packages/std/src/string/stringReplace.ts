import escapeRegExp from './escapeRegExp';

export type StringReplaceOptions = {
  replacement: string | StringReplacer;
  all?: boolean;
  case?: boolean;
};

/**
 * Builds the replacement for one match.
 *
 * The first argument is the matched substring, then one argument per capture
 * group, then the offset and the whole input — the same call shape
 * `String.prototype.replace` uses, and the reason the rest stays `any[]`:
 * the groups are strings, the offset a number, so no one element type fits.
 */
export type StringReplacer = (substring: string, ...args: any[]) => string;

/**
 * Returns a new string with one, some, or all matches of a pattern replaced by a replacement.
 *
 * @example
 *
 * stringReplace('abc', 'a', { replacement: 'x' }) //=> 'xbc'
 *
 * stringReplace('abc abc', 'a', { replacement: 'x', all: true }) //=> 'xbc xbc'
 */
export default function stringReplace(
  str: string,
  pattern: string | RegExp,
  options: StringReplaceOptions,
): string {
  if (pattern == null) {
    return str;
  }

  const { replacement, all = false, case: caseSensitive = false } = options;
  const source =
    typeof pattern === 'string' ? escapeRegExp(pattern) : pattern.source;
  const flags = new Set(typeof pattern === 'string' ? '' : pattern.flags);

  if (all) {
    flags.add('g');
  }
  if (caseSensitive) {
    flags.add('i');
  }

  return str.replace(
    new RegExp(source, Array.from(flags).join('')),
    replacement as any,
  );
}
