/**
 * Latin letters that Unicode normalisation cannot take apart.
 *
 * `NFD` splits a character into a base letter plus combining marks, which
 * handles `é`, `ü`, `ñ` and the rest. But a letter formed with a stroke, a bar
 * or a ligature — `ø`, `ł`, `đ`, `æ`, `ß` — is atomic: it has no decomposition,
 * so normalising leaves it untouched and it has to be transliterated by hand.
 * Missing these is why naive `NFD` deburring deletes letters out of Nordic,
 * Polish, German and Croatian words instead of converting them.
 */
const ATOMIC_LATIN: Record<string, string> = {
  Æ: 'Ae',
  æ: 'ae',
  Œ: 'Oe',
  œ: 'oe',
  Ø: 'O',
  ø: 'o',
  Ð: 'D',
  ð: 'd',
  Đ: 'D',
  đ: 'd',
  Ł: 'L',
  ł: 'l',
  Þ: 'Th',
  þ: 'th',
  ẞ: 'Ss',
  ß: 'ss',
  Ħ: 'H',
  ħ: 'h',
  Ŧ: 'T',
  ŧ: 't',
  Ŋ: 'N',
  ŋ: 'n',
  İ: 'I',
  ı: 'i',
  Ə: 'E',
  ə: 'e',
  Ƶ: 'Z',
  ƶ: 'z',
  Ɨ: 'I',
  ɨ: 'i',
  Ʉ: 'U',
  ʉ: 'u',
};

const ATOMIC_REGEX = new RegExp(`[${Object.keys(ATOMIC_LATIN).join('')}]`, 'g');

/**
 * A Latin base letter carrying combining marks.
 *
 * The marks are only stripped when they sit on a Latin letter. Stripping every
 * combining mark in the Combining Diacritical Marks block would corrupt other
 * scripts, because a mark that is an accent in Latin can be part of the letter
 * itself elsewhere: Cyrillic `й` decomposes to `и` plus a breve, and `ё` to `е`
 * plus a diaeresis, but those are separate letters of the alphabet rather than
 * decorated ones — turning `Йогурт` into `Иогурт` is a misspelling, not a
 * normalisation. Greek accents behave the same way.
 *
 * The range covers Basic Latin through Latin Extended-B, stopping short of
 * Greek at U+0370 and Cyrillic at U+0400.
 */
const LATIN_WITH_MARKS = /([A-Za-zÀ-ɏ])[̀-ͯ]+/g;

/**
 * Removes accents and other diacritics from Latin text, leaving the base
 * letters.
 *
 * Case is preserved — this normalises characters, it does not transform case.
 * Letters outside the Latin scripts are left alone, so Greek, Cyrillic, Arabic
 * and CJK text passes through unchanged rather than being mangled.
 *
 * @param {string} str The string to normalise.
 * @returns {string} The string with its diacritics removed.
 *
 * @example
 * stripDiacritics('José') //=> 'Jose'
 * stripDiacritics('Ångström') //=> 'Angstrom'
 *
 * @example
 * // Letters with no decomposition are transliterated, not dropped.
 * stripDiacritics('Straße') //=> 'Strasse'
 * stripDiacritics('Ølberg') //=> 'Olberg'
 *
 * @example
 * // Useful for accent-insensitive search.
 * stripDiacritics(query).toLowerCase() === stripDiacritics(name).toLowerCase()
 */
export default function stripDiacritics(str: string): string {
  return (
    str
      .normalize('NFD')
      .replace(LATIN_WITH_MARKS, '$1')
      // Marks left on other scripts are recomposed, so text that was not the
      // target of this function comes back exactly as it went in.
      .normalize('NFC')
      .replace(ATOMIC_REGEX, (char) => ATOMIC_LATIN[char])
  );
}
