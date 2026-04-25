import { escapeHTML, stringWidth, stripANSI } from '../../src';

describe('String Utilities', () => {
  test('escapeHTML', () => {
    expect(escapeHTML('<div>')).toBe('&lt;div&gt;');
    expect(escapeHTML('a & b')).toBe('a &amp; b');
    expect(escapeHTML('"quoted"')).toBe('&quot;quoted&quot;');
    expect(escapeHTML("'single'")).toBe('&#39;single&#39;');
  });

  test('stripANSI', () => {
    expect(stripANSI('\x1b[31mHello\x1b[0m')).toBe('Hello');
    expect(stripANSI('\x1b[4mUnderline\x1b[0m')).toBe('Underline');
    expect(stripANSI('No ANSI')).toBe('No ANSI');
  });

  test('stringWidth', () => {
    expect(stringWidth('abc')).toBe(3);
    expect(stringWidth('\x1b[31mabc\x1b[0m')).toBe(3);
    expect(stringWidth('🔥')).toBe(2);
    expect(stringWidth('こんにちは')).toBe(10);
    expect(stringWidth('')).toBe(0);
  });
});
