/**
 * Checks if the current runtime is Bun.
 *
 * @returns {boolean} True if running in Bun, false otherwise.
 *
 * @example
 * isBun() //=> true (in Bun)
 * isBun() //=> false (in Node.js)
 */
export default function isBun(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.bun != null
  );
}
