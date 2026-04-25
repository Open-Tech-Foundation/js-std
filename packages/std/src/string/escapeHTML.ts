/**
 * Escapes characters for use in HTML.
 *
 * @example
 *
 * escapeHTML('<script>alert("xss")</script>')
 * //=> '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export default function escapeHTML(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}
