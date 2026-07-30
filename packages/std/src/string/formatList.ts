// The English forms `Intl.ListFormat` produces, used where the runtime has no
// `Intl.ListFormat` at all. `pair` joins exactly two items, which several
// languages punctuate differently from a longer list.
const FALLBACK: Record<string, { pair: string; sep: string; last: string }> = {
  'conjunction-long': { pair: ' and ', sep: ', ', last: ', and ' },
  'conjunction-short': { pair: ' & ', sep: ', ', last: ', & ' },
  'conjunction-narrow': { pair: ', ', sep: ', ', last: ', ' },
  'disjunction-long': { pair: ' or ', sep: ', ', last: ', or ' },
  'disjunction-short': { pair: ' or ', sep: ', ', last: ', or ' },
  'disjunction-narrow': { pair: ' or ', sep: ', ', last: ', or ' },
  'unit-long': { pair: ', ', sep: ', ', last: ', ' },
  'unit-short': { pair: ', ', sep: ', ', last: ', ' },
  'unit-narrow': { pair: ' ', sep: ' ', last: ' ' },
};

export interface FormatListOptions {
  /** `'conjunction'` for "and", `'disjunction'` for "or", `'unit'` for neither. */
  type?: 'conjunction' | 'disjunction' | 'unit';
  /** How wordy the connector is. Defaults to `'long'`. */
  style?: 'long' | 'short' | 'narrow';
  /** The locale (default runtime locale). */
  locale?: string;
}

/**
 * Joins a list of strings into readable prose.
 *
 * `items.join(', ')` gives `'a, b, c'`, which is not a sentence. This gives
 * `'a, b, and c'` — with the connector, the punctuation before it and the
 * separate form a two-item list takes, all of which differ by language and
 * none of which are worth hand-rolling.
 *
 * Where the runtime provides `Intl.ListFormat` it is used, and the result is
 * as correct as the runtime's locale data. Where it does not — some embedded
 * and edge runtimes ship without it — the English forms are produced instead,
 * so the shape of the output never changes with the host, only the language.
 *
 * @param {string[]} items The strings to join.
 * @param {FormatListOptions} [options] The options object.
 * @returns {string} The joined string, empty for an empty list.
 * @throws {RangeError} If `type` or `style` is not one of its allowed values.
 *
 * @example
 * formatList(['a', 'b', 'c']) //=> 'a, b, and c'
 * formatList(['a', 'b']) //=> 'a and b'
 * formatList(['a']) //=> 'a'
 * formatList([]) //=> ''
 *
 * @example
 * formatList(['a', 'b', 'c'], { type: 'disjunction' }) //=> 'a, b, or c'
 * formatList(['a', 'b', 'c'], { type: 'unit' }) //=> 'a, b, c'
 * formatList(['a', 'b', 'c'], { style: 'short' }) //=> 'a, b, & c'
 *
 * @example
 * formatList(['a', 'b', 'c'], { locale: 'de-DE' }) //=> 'a, b und c'
 */
export default function formatList(
  items: string[] = [],
  options: FormatListOptions = {},
): string {
  const { type = 'conjunction', style = 'long', locale } = options;

  if (type !== 'conjunction' && type !== 'disjunction' && type !== 'unit') {
    throw new RangeError(
      "The type option must be one of 'conjunction', 'disjunction', or 'unit'.",
    );
  }

  if (style !== 'long' && style !== 'short' && style !== 'narrow') {
    throw new RangeError(
      "The style option must be one of 'long', 'short', or 'narrow'.",
    );
  }

  // Checked per call rather than once at import, so a polyfill loaded after
  // this module is still picked up — and so the fallback can be exercised.
  if (typeof Intl.ListFormat === 'function') {
    return new Intl.ListFormat(locale, { type, style }).format(items);
  }

  if (items.length === 0) {
    return '';
  }
  if (items.length === 1) {
    return items[0];
  }

  const forms = FALLBACK[`${type}-${style}`];

  if (items.length === 2) {
    return items[0] + forms.pair + items[1];
  }

  return (
    items.slice(0, -1).join(forms.sep) + forms.last + items[items.length - 1]
  );
}
