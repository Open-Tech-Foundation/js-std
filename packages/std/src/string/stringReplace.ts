import shallowMerge from '../object/shallowMerge';

export type StringReplaceOptions = { all?: boolean; case?: boolean };

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
  replacement: string,
  options?: StringReplaceOptions,
): string {
  const defaultOptions: StringReplaceOptions = { all: false, case: false };
  const opts = shallowMerge(
    defaultOptions,
    options as Record<string, unknown>,
  ) as StringReplaceOptions;
  let flags = '';
  flags = opts.all ? `${flags}g` : flags;
  flags = opts.case ? `${flags}i` : flags;

  return str.replace(new RegExp(pattern, flags), replacement);
}
