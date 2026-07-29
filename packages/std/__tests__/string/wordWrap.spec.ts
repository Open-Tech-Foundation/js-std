import { stringWidth, stripANSI, wordWrap } from '../../src';

/** Every produced line, so widths can be asserted one by one. */
function lines(wrapped: string): string[] {
  return wrapped.split('\n');
}

describe('wordWrap', () => {
  test('breaks at whitespace', () => {
    expect(wordWrap('the quick brown fox', 10)).toBe('the quick\nbrown fox');
  });

  test('leaves text shorter than the width alone', () => {
    expect(wordWrap('short', 10)).toBe('short');
  });

  test('fills each line up to the width', () => {
    expect(wordWrap('a b c d e f', 5)).toBe('a b c\nd e f');
  });

  test('breaks exactly at the width, not one short', () => {
    expect(wordWrap('abcde fg', 5)).toBe('abcde\nfg');
    expect(wordWrap('abcd fg', 5)).toBe('abcd\nfg');
  });

  test('defaults to 80 columns', () => {
    const text = 'word '.repeat(30).trim();

    for (const line of lines(wordWrap(text))) {
      expect(stringWidth(line)).toBeLessThanOrEqual(80);
    }
  });

  test('returns an empty string for empty input', () => {
    expect(wordWrap('', 10)).toBe('');
  });

  test('collapses the whitespace run that falls on a break', () => {
    expect(wordWrap('aaa      bbb', 5)).toBe('aaa\nbbb');
  });

  test('preserves whitespace runs that do not fall on a break', () => {
    expect(wordWrap('a  b', 10)).toBe('a  b');
  });

  test('never leaves trailing whitespace on a line', () => {
    for (const line of lines(wordWrap('one two three four five', 9))) {
      expect(line).toBe(line.trimEnd());
    }
  });

  describe('line structure', () => {
    test('wraps each input line on its own', () => {
      expect(wordWrap('aaa bbb\nccc ddd', 7)).toBe('aaa bbb\nccc ddd');
    });

    test('preserves blank lines', () => {
      expect(wordWrap('a\n\nb', 10)).toBe('a\n\nb');
    });

    test('normalises CRLF and CR to LF', () => {
      expect(wordWrap('a\r\nb', 10)).toBe('a\nb');
      expect(wordWrap('a\rb', 10)).toBe('a\nb');
    });

    test('keeps the indent of a line but does not repeat it', () => {
      expect(wordWrap('    aaa bbb ccc', 8)).toBe('    aaa\nbbb ccc');
    });

    test('keeps an indent that leaves no room, rather than dropping it', () => {
      expect(wordWrap('    aaa', 3)).toBe('    aaa');
    });
  });

  describe('long words', () => {
    test('lets a word overrun by default', () => {
      expect(wordWrap('a supercalifragilistic b', 5)).toBe(
        'a\nsupercalifragilistic\nb',
      );
    });

    test('breaks a word under hard', () => {
      expect(wordWrap('a supercalifragilistic b', 5, { hard: true })).toBe(
        'a\nsuper\ncalif\nragil\nistic\nb',
      );
    });

    test('moves the word to a fresh line before breaking it', () => {
      // Breaking is a last resort: the word first gets a whole line to try to
      // fit on, so its start stays aligned rather than beginning mid-line.
      expect(wordWrap('ab cdefghij', 5, { hard: true })).toBe('ab\ncdefg\nhij');
    });

    test('does not break a word that fits on a line of its own', () => {
      expect(wordWrap('ab cdefg', 5, { hard: true })).toBe('ab\ncdefg');
    });

    test('keeps every hard-wrapped line inside the width', () => {
      const text = `x ${'y'.repeat(37)} z`;

      for (const line of lines(wordWrap(text, 8, { hard: true }))) {
        expect(stringWidth(line)).toBeLessThanOrEqual(8);
      }
    });

    test('loses nothing when it breaks a word', () => {
      const text = 'alpha bravocharliedeltaechofoxtrot golf';
      const wrapped = wordWrap(text, 7, { hard: true });

      expect(wrapped.replace(/\n/g, '')).toBe(text.replace(/ /g, ''));
    });

    test('terminates at a width of one', () => {
      expect(wordWrap('abc', 1, { hard: true })).toBe('a\nb\nc');
    });
  });

  describe('width measurement', () => {
    test('counts a CJK character as two columns', () => {
      // Six columns of text, so it cannot sit on a five-column line.
      expect(wordWrap('日本語 abc', 6)).toBe('日本語\nabc');
      expect(stringWidth('日本語')).toBe(6);
    });

    test('does not split a grapheme when breaking hard', () => {
      const wrapped = wordWrap('日本語テスト', 4, { hard: true });

      expect(lines(wrapped)).toEqual(['日本', '語テ', 'スト']);
    });

    test('lets a character wider than the width overrun by one, not stall', () => {
      expect(wordWrap('日本', 1, { hard: true })).toBe('日\n本');
    });

    test('does not split an emoji into surrogates', () => {
      for (const line of lines(wordWrap('🔥🔥🔥', 3, { hard: true }))) {
        expect(line).not.toContain('\ufffd');
        expect([...line].length % 1).toBe(0);
      }
    });
  });

  describe('ANSI escapes', () => {
    const red = '\u001b[31m';
    const reset = '\u001b[0m';

    test('does not count escapes toward the width', () => {
      const wrapped = wordWrap(`${red}aaa bbb${reset}`, 7);

      expect(wrapped).not.toContain('\n');
      expect(stripANSI(wrapped)).toBe('aaa bbb');
    });

    test('wraps styled text by its visible width', () => {
      const wrapped = wordWrap(`${red}aaa${reset} ${red}bbb${reset}`, 5);

      expect(lines(stripANSI(wrapped))).toEqual(['aaa', 'bbb']);
    });

    test('keeps an escape sequence intact when breaking hard', () => {
      const wrapped = wordWrap(`${red}abcdef${reset}`, 3, { hard: true });

      expect(lines(stripANSI(wrapped))).toEqual(['abc', 'def']);
      // The sequences survived whole — stripping removed them entirely.
      expect(stripANSI(wrapped)).not.toContain('\u001b');
      expect(stripANSI(wrapped)).not.toContain('[31m');
    });
  });

  describe('validation', () => {
    test('rejects a width below one', () => {
      expect(() => wordWrap('a', 0)).toThrow(RangeError);
      expect(() => wordWrap('a', -1)).toThrow(RangeError);
    });

    test('rejects a non-integer width', () => {
      expect(() => wordWrap('a', 2.5)).toThrow(RangeError);
      expect(() => wordWrap('a', Number.POSITIVE_INFINITY)).toThrow(RangeError);
      expect(() => wordWrap('a', Number.NaN)).toThrow(RangeError);
    });
  });
});
