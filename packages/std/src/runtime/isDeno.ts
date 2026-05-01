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
    typeof (globalThis as any).Deno !== 'undefined' &&
    typeof (globalThis as any).Deno.version !== 'undefined' &&
    typeof (globalThis as any).Deno.version.deno !== 'undefined'
  );
}
