/**
 * Suspends the execution for the given number of milliseconds.
 *
 * @param {number} [ms=0] The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the given time.
 *
 * @example
 * await sleep(1000)
 */
export default async function sleep(ms = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
