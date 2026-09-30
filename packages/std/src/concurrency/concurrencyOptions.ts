/** Options shared by bounded asynchronous array utilities. */
export interface ConcurrencyOptions {
  /** Maximum number of callbacks running at once; defaults to `Infinity`. */
  concurrency?: number;
}

/** Read and validate the options object used by a concurrent array utility. */
export function getConcurrency(options: ConcurrencyOptions = {}): number {
  if (
    options === null ||
    typeof options !== 'object' ||
    Array.isArray(options)
  ) {
    throw new TypeError('Options must be an object.');
  }

  return options.concurrency ?? Number.POSITIVE_INFINITY;
}
