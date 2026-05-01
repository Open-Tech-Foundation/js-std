/**
 * Checks if the current runtime is a web browser.
 *
 * @returns {boolean} True if running in a browser, false otherwise.
 *
 * @example
 * isBrowser() //=> true (in browser)
 * isBrowser() //=> false (in Node.js)
 */
export default function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.document !== 'undefined'
  );
}
