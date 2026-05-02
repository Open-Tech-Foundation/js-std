/**
 * Reverses a string using grapheme cluster awareness via Intl.Segmenter.
 * Correctly handles surrogate pairs, combining marks, and emoji sequences.
 *
 * @param {string} str The string to reverse.
 * @returns {string} The reversed string.
 *
 * @example
 * stringReverse('hello') //=> 'olleh'
 * stringReverse('café') //=> 'éfac'
 * stringReverse('👨‍👩‍👧‍👦') //=> '👨‍👩‍👧‍👦'
 */
export default function stringReverse(str: string): string {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }

  if (!globalThis.Intl || !globalThis.Intl.Segmenter) {
    throw new Error(
      'Intl.Segmenter is not supported in this environment. Use a polyfill or a modern runtime.',
    );
  }

  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  const graphemes = [...segmenter.segment(str)].map((s) => s.segment);
  return graphemes.reverse().join('');
}
