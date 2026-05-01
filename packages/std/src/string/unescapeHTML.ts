/**
 * Unescapes HTML entities back to their original characters.
 *
 * @example
 *
 * unescapeHTML('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
 * //=> '<script>alert("xss")</script>'
 */
export default function unescapeHTML(str: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  return str.replace(/&(amp|lt|gt|quot|#39);/g, (m) => map[m]);
}
