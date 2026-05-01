/**
 * Checks if the current runtime is Deno.
 *
 * @returns {boolean} True if running in Deno, false otherwise.
 *
 * @example
 * isDeno() //=> true (in Deno)
 * isDeno() //=> false (in Node.js)
 */
export default function isDeno(): boolean {
  return (
    typeof Deno !== 'undefined' &&
    typeof Deno.version !== 'undefined' &&
    typeof Deno.version.deno !== 'undefined'
  );
}
