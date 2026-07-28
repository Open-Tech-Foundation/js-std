import { stripDiacritics } from '../../src';

describe('stripDiacritics', () => {
  test('removes combining accents', () => {
    expect(stripDiacritics('José')).toBe('Jose');
    expect(stripDiacritics('naïve')).toBe('naive');
    expect(stripDiacritics('Ångström')).toBe('Angstrom');
    expect(stripDiacritics('crème brûlée')).toBe('creme brulee');
    expect(stripDiacritics('Nguyễn')).toBe('Nguyen');
  });

  test('transliterates letters that have no decomposition', () => {
    // These are atomic in Unicode, so normalising alone would leave them and a
    // naive ASCII filter would delete them outright.
    expect(stripDiacritics('Ølberg')).toBe('Olberg');
    expect(stripDiacritics('Straße')).toBe('Strasse');
    expect(stripDiacritics('Œuvre')).toBe('Oeuvre');
    expect(stripDiacritics('Łódź')).toBe('Lodz');
    expect(stripDiacritics('Đorđe')).toBe('Dorde');
    expect(stripDiacritics('Ægir')).toBe('Aegir');
    expect(stripDiacritics('Þór')).toBe('Thor');
  });

  test('handles a letter carrying both a stroke and an accent', () => {
    expect(stripDiacritics('Ǽsir')).toBe('Aesir');
    expect(stripDiacritics('ǻ')).toBe('a');
  });

  test('preserves case', () => {
    expect(stripDiacritics('ÉCOLE')).toBe('ECOLE');
    expect(stripDiacritics('École')).toBe('Ecole');
    expect(stripDiacritics('Ø')).toBe('O');
    expect(stripDiacritics('ø')).toBe('o');
    expect(stripDiacritics('ẞ')).toBe('Ss');
    expect(stripDiacritics('ß')).toBe('ss');
  });

  test('leaves plain ASCII untouched', () => {
    expect(stripDiacritics('Hello World!')).toBe('Hello World!');
    expect(stripDiacritics('')).toBe('');
    expect(stripDiacritics('abc-123_XYZ')).toBe('abc-123_XYZ');
  });

  test('leaves Cyrillic untouched', () => {
    // й is и plus a breve and ё is е plus a diaeresis, but both are letters of
    // the alphabet in their own right — stripping the mark misspells the word.
    expect(stripDiacritics('Йогурт')).toBe('Йогурт');
    expect(stripDiacritics('ёлка')).toBe('ёлка');
    expect(stripDiacritics('Привет мир')).toBe('Привет мир');
    expect(stripDiacritics('й')).toBe('й');
    expect(stripDiacritics('ё')).toBe('ё');
  });

  test('leaves Greek untouched', () => {
    expect(stripDiacritics('Ελλάδα')).toBe('Ελλάδα');
    expect(stripDiacritics('ή')).toBe('ή');
    expect(stripDiacritics('ᾆ')).toBe('ᾆ');
  });

  test('leaves other scripts untouched', () => {
    expect(stripDiacritics('日本語')).toBe('日本語');
    expect(stripDiacritics('مرحبا')).toBe('مرحبا');
    expect(stripDiacritics('हिन्दी')).toBe('हिन्दी');
    expect(stripDiacritics('한국어')).toBe('한국어');
    expect(stripDiacritics('🌍 emoji')).toBe('🌍 emoji');
  });

  test('normalises mixed Latin and non-Latin text', () => {
    expect(stripDiacritics('Café Йогурт')).toBe('Cafe Йогурт');
  });

  test('returns the same result when applied twice', () => {
    for (const input of ['José', 'Straße', 'Ølberg', 'Йогурт', 'Ελλάδα']) {
      const once = stripDiacritics(input);
      expect(stripDiacritics(once)).toBe(once);
    }
  });

  test('accepts input in either normalisation form', () => {
    const composed = 'é'.normalize('NFC');
    const decomposed = 'é'.normalize('NFD');

    expect(composed).not.toBe(decomposed);
    expect(stripDiacritics(composed)).toBe('e');
    expect(stripDiacritics(decomposed)).toBe('e');
  });

  test('supports accent-insensitive comparison', () => {
    const matches = (a: string, b: string) =>
      stripDiacritics(a).toLowerCase() === stripDiacritics(b).toLowerCase();

    expect(matches('jose', 'José')).toBe(true);
    expect(matches('MALMO', 'Malmö')).toBe(true);
    expect(matches('jose', 'Josef')).toBe(false);
  });
});
