import shallowMerge from '../object/shallowMerge';

export type StrReplaceOptions = { all?: boolean; case?: boolean };

/**
 * Returns a new string with one, some, or all matches of a pattern replaced by a replacement.
 *
 * @example
 * const a = { a: { b: 1 } };
 * const b = { a: { c: 2 } };
 * merge(a, b); //=> {a: { b: 1, c: 2 } }
 */
export default function strReplace(
  str: string,
  pattern: string | RegExp,
  replacement: string,
  options?: StrReplaceOptions
): string {
  const defaultOptions: StrReplaceOptions = { all: false, case: false };
  const opts = shallowMerge(
    defaultOptions,
    options as object
  ) as StrReplaceOptions;
  let flags = '';
  flags = opts.all ? flags + 'g' : flags;
  flags = opts.case ? flags + 'i' : flags;

  return str.replace(new RegExp(pattern, flags), replacement);
}
