/**
 * Checks if the current runtime is Node.js.
 *
 * @returns {boolean} True if running in Node.js, false otherwise.
 *
 * @example
 * isNode() //=> true (in Node.js)
 * isNode() //=> false (in browser)
 */
export default function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null &&
    process.versions.bun == null
  );
}
