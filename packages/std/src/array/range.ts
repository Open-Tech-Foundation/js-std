type RangeOptions = {
  start?: number;
  step?: number;
  inclusiveEnd?: boolean;
  inclusive?: boolean;
};

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

  if (!Number.isFinite(start) || !Number.isFinite(step)) {
    throw new Error('Infinity is not allowed');
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
