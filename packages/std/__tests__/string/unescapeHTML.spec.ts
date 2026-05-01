import { escapeHTML, unescapeHTML } from '../../src';

describe('String > unescapeHTML', () => {
  test('unescapes all supported entities', () => {
    expect(unescapeHTML('&lt;div&gt;')).toBe('<div>');
    expect(unescapeHTML('&quot;hello&quot;')).toBe('"hello"');
    expect(unescapeHTML('&#39;single&#39;')).toBe("'single'");
    expect(unescapeHTML('Tom &amp; Jerry')).toBe('Tom & Jerry');
  });

  test('round-trips with escapeHTML', () => {
    const original = '<script>alert("xss")</script>';
    expect(unescapeHTML(escapeHTML(original))).toBe(original);
  });

  test('handles strings without entities', () => {
    expect(unescapeHTML('hello')).toBe('hello');
  });
});
