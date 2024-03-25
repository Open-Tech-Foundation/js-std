/**
 * It suspends the execution for the given milliseconds.
 *
 * @example
 *
 * await sleep(1000) // It sleeps for 1 second
 */
export default async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
