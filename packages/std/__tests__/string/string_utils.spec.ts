import { escapeHTML, stringWidth, stripANSI } from '../../src';

describe('String Utilities', () => {
  test('escapeHTML', () => {
    expect(escapeHTML('<div>')).toBe('&lt;div&gt;');
    expect(escapeHTML('a & b')).toBe('a &amp; b');
    expect(escapeHTML('"quoted"')).toBe('&quot;quoted&quot;');
    expect(escapeHTML("'single'")).toBe('&#39;single&#39;');
  });

  describe('stripANSI (Official cases)', () => {
    test('strip color from string', () => {
      expect(
        stripANSI(
          '\u001B[0m\u001B[4m\u001B[42m\u001B[31mfoo\u001B[39m\u001B[49m\u001B[24mfoo\u001B[0m'
        )
      ).toBe('foofoo');
    });

    test('strip color from ls command', () => {
      expect(
        stripANSI('\u001B[00;38;5;244m\u001B[m\u001B[00;38;5;33mfoo\u001B[0m')
      ).toBe('foo');
    });

    test('strip link from terminal link', () => {
      expect(stripANSI('\u001B]8;;https://github.com\u0007click\u001B]8;;\u0007')).toBe(
        'click'
      );
    });

    test('strip OSC sequence with BEL terminator', () => {
      const input =
        '\u001B[2J\u001B[m\u001B[HABC\r\n\u001B]0;C:\\WINDOWS\\system32\\cmd.exe\u0007\u001B[?25h';
      expect(stripANSI(input)).toBe('ABC\r\n');
    });

    test('strip color from string using 8-bit CSI introducer', () => {
      expect(stripANSI('\u009B31mfoo\u009B39m')).toBe('foo');
    });
  });

  describe('stringWidth (Official cases)', () => {
    test('Basic functionality', () => {
      expect(stringWidth('')).toBe(0);
      expect(stringWidth('a')).toBe(1);
      expect(stringWidth('hello world')).toBe(11);
    });

    test('East Asian width categories', () => {
      expect(stringWidth('你好')).toBe(4);
      expect(stringWidth('hello世界')).toBe(9);
    });

    test('Control characters (should be ignored)', () => {
      expect(stringWidth('\u0000')).toBe(0);
      expect(stringWidth('\t')).toBe(0);
      expect(stringWidth('\n')).toBe(0);
      expect(stringWidth('a\u0001b')).toBe(2);
    });

    test('ANSI escape sequences', () => {
      expect(stringWidth('\u001B[31mred\u001B[0m')).toBe(3);
      expect(
        stringWidth('\u001B]8;;https://example.com\u0007link\u001B]8;;\u0007')
      ).toBe(4);
    });

    test('Zero-width characters', () => {
      expect(stringWidth('a\u200Bb')).toBe(2);
      expect(stringWidth('a\u200Cb')).toBe(2);
      expect(stringWidth('a\u200Db')).toBe(2);
      expect(stringWidth('\u200C')).toBe(0);
    });

    test('Combining characters', () => {
      expect(stringWidth('e\u0301')).toBe(1);
      expect(stringWidth('e\u0301\u0302')).toBe(1);
      expect(stringWidth('\u0301\u0302')).toBe(0);
    });

    test('Emoji and surrogate pairs', () => {
      expect(stringWidth('😀')).toBe(2);
      expect(stringWidth('a😀b')).toBe(4);
      expect(stringWidth('👋🏽')).toBe(2);
    });

    test('Soft hyphen', () => {
      expect(stringWidth('\u00AD')).toBe(0);
      expect(stringWidth('a\u00ADb')).toBe(2);
    });
  });
});
