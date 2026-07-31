import { levenshtein } from '../../src';

/** The plain full-matrix algorithm, to check the rolling-row one against. */
function reference(a: string, b: string): number {
  const s = [...a];
  const t = [...b];
  const d: number[][] = Array.from({ length: s.length + 1 }, () =>
    new Array(t.length + 1).fill(0),
  );

  for (let i = 0; i <= s.length; i++) d[i][0] = i;
  for (let j = 0; j <= t.length; j++) d[0][j] = j;

  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= t.length; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (s[i - 1] === t[j - 1] ? 0 : 1),
      );
    }
  }

  return d[s.length][t.length];
}

describe('String > levenshtein', () => {
  test('counts the edits of the classic example', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
  });

  test('is zero for identical strings', () => {
    expect(levenshtein('abc', 'abc')).toBe(0);
    expect(levenshtein('', '')).toBe(0);
  });

  test('is the other length when one string is empty', () => {
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('abc', '')).toBe(3);
    expect(levenshtein()).toBe(0);
    expect(levenshtein('abc')).toBe(3);
  });

  test('counts a single substitution, insertion and deletion', () => {
    expect(levenshtein('cat', 'bat')).toBe(1);
    expect(levenshtein('cat', 'cart')).toBe(1);
    expect(levenshtein('cart', 'cat')).toBe(1);
  });

  test('counts a transposition as two edits, not one', () => {
    // This is Levenshtein, not Damerau-Levenshtein.
    expect(levenshtein('ab', 'ba')).toBe(2);
  });

  test('is symmetric', () => {
    const pairs: [string, string][] = [
      ['kitten', 'sitting'],
      ['flaw', 'lawn'],
      ['saturday', 'sunday'],
      ['', 'abc'],
      ['a', 'bcdef'],
    ];

    for (const [a, b] of pairs) {
      expect(levenshtein(a, b)).toBe(levenshtein(b, a));
    }
  });

  test('never exceeds the length of the longer string', () => {
    expect(levenshtein('abc', 'xyz')).toBe(3);
    expect(levenshtein('abc', 'wxyz')).toBe(4);
  });

  test('counts a code point as one edit, not two UTF-16 units', () => {
    // '😀'.length is 2, so a unit-based implementation says 2 here.
    expect(levenshtein('a😀', 'a')).toBe(1);
    expect(levenshtein('😀', '😁')).toBe(1);
    expect(levenshtein('a😀b', 'ab')).toBe(1);
  });

  test('treats a combining mark as its own character', () => {
    const composed = '\u00e9';
    const decomposed = 'e\u0301';

    expect(levenshtein(composed, decomposed)).toBe(2);
    // Normalising first is how to compare what a reader would see.
    expect(levenshtein(composed, decomposed.normalize('NFC'))).toBe(0);
  });

  test('agrees with the full-matrix algorithm on many random pairs', () => {
    const alphabet = 'abcde';
    let seed = 12345;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    const word = () =>
      Array.from(
        { length: Math.floor(rand() * 9) },
        () => alphabet[Math.floor(rand() * alphabet.length)],
      ).join('');

    for (let i = 0; i < 400; i++) {
      const a = word();
      const b = word();

      expect(levenshtein(a, b)).toBe(reference(a, b));
    }
  });

  test('gives the same answer whichever way round the longer string is', () => {
    // The implementation swaps to keep the row short; that must not change it.
    expect(levenshtein('a', 'abcdefghij')).toBe(9);
    expect(levenshtein('abcdefghij', 'a')).toBe(9);
  });

  test('ranks suggestions by distance', () => {
    const commands = ['install', 'uninstall', 'update', 'list'];
    const ranked = [...commands].sort(
      (a, b) => levenshtein(a, 'instal') - levenshtein(b, 'instal'),
    );

    expect(ranked[0]).toBe('install');
  });
});
