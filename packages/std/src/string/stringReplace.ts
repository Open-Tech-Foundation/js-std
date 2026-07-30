import shallowMerge from '../object/shallowMerge';
import escapeRegExp from './escapeRegExp';

export type StringReplaceOptions = { all?: boolean; case?: boolean };

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
 * stringReplace('abc', 'a', 'x') //=> 'xbc'
 *
 * stringReplace('abc abc', 'a', 'x', { all: true }) //=> 'xbc xbc'
 */
export default function stringReplace(
  str: string,
  pattern: string | RegExp,
  replacement: string | StringReplacer,
  options?: StringReplaceOptions,
): string {
  if (pattern == null) {
    return str;
  }

  const defaultOptions: StringReplaceOptions = { all: false, case: false };
  const opts = shallowMerge(
    defaultOptions,
    options as Record<string, unknown>,
  ) as StringReplaceOptions;
  const source =
    typeof pattern === 'string' ? escapeRegExp(pattern) : pattern.source;
  const flags = new Set(typeof pattern === 'string' ? '' : pattern.flags);

  if (opts.all) {
    flags.add('g');
  }
  if (opts.case) {
    flags.add('i');
  }

  return str.replace(
    new RegExp(source, Array.from(flags).join('')),
    replacement as any,
  );
}
