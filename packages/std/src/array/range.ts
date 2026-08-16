type RangeOptions = {
  start?: number;
  step?: number;
  inclusiveEnd?: boolean;
  inclusive?: boolean;
};

/**
 * The most values a single range will produce.
 *
 * Ten million is far past any real use and still allocates about eighty
 * megabytes, so the limit is there to turn an unbounded loop into an error
 * rather than to be a working budget.
 */
export const MAX_RANGE_LENGTH = 10_000_000;

/**
 * Creates an array of numbers progressing from start up to, but not including, end.
 *
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number|Object} options The step or options object.
 * @returns {number[]} A new array of numbers.
 *
 * @example
 * range(4) //=> [0, 1, 2, 3]
 * range(-4) //=> [0, -1, -2, -3]
 * range(1, 5) //=> [1, 2, 3, 4]
 * range(0, 20, 5) //=> [0, 5, 10, 15]
 * range(1, 4, {step: 1, inclusiveEnd: true}) //=> [1, 2, 3, 4]
 */
export default function range(
  ...args: [number?, number?, (RangeOptions | number)?]
): number[] {
  const [startOrEnd, end, options] = args;
  if (
    args.length === 0 ||
    (args.length === 1 && startOrEnd === 0) ||
    typeof startOrEnd !== 'number' ||
    (end !== undefined && typeof end !== 'number') ||
    (options !== undefined &&
      options !== null &&
      typeof options !== 'number' &&
      typeof options !== 'object')
  ) {
    throw new Error('Invalid arguments');
  }
  const start = end === undefined ? 0 : (startOrEnd as number);
  const stop = end === undefined ? (startOrEnd as number) : (end as number);
  let step: number;

  if (
    options &&
    typeof options === 'object' &&
    options.step !== undefined &&
    typeof options.step !== 'number'
  ) {
    throw new Error('Step must be a number');
  }

  const inclusive =
    options && typeof options === 'object'
      ? options.inclusive ?? options.inclusiveEnd ?? false
      : false;

  if (typeof options === 'number') {
    step = options;
  } else {
    step = options?.step ?? (start < stop ? 1 : -1);
  }

  if (Number.isNaN(start) || Number.isNaN(stop) || Number.isNaN(step)) {
    throw new Error('NaN is not allowed');
  }

  if (step === 0) {
    throw new Error('Step cannot be zero');
  }

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(step) ||
    !Number.isFinite(stop)
  ) {
    throw new Error('Infinity is not allowed');
  }

  // The loop below is bounded only by the values it was given, so a large end
  // — or one taken from a caller — used to run until the process ran out of
  // memory. `range(1e308)` passed every check above and never returned.
  const count = Math.ceil((stop - start) / step) + (inclusive ? 1 : 0);

  if (count > MAX_RANGE_LENGTH) {
    throw new RangeError(
      `The range would hold ${count} values, above the limit of ${MAX_RANGE_LENGTH}.`,
    );
  }

  const result: number[] = [];
  let n = 0;

  while (true) {
    const i = start + n * step;
    if (step > 0) {
      if (inclusive ? i > stop : i >= stop) break;
    } else {
      if (inclusive ? i < stop : i <= stop) break;
    }
    result.push(i);
    n++;
  }

  return result;
}
