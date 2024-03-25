import isInfinity from '../types/isInfinity';
import isNum from '../types/isNum';

/**
 * It generates a sequence of numbers starting at the first argument,
 * progressing by the third argument, and stopping at the second argument.
 *
 * @example
 *
 * range(0, 5) // [0, 1, 2, 3, 4]
 */
export default function range(
  start: number,
  end: number,
  options?: number | { step: number; inclusive: boolean }
) {
  if (Number.isNaN(start) || Number.isNaN(end)) {
    throw new RangeError();
  }

  if (!isNum(start) || !isNum(end)) {
    throw new TypeError();
  }

  if (isInfinity(start)) {
    throw RangeError();
  }

  const ifIncrease = end > start;

  let inclusiveEnd = false;
  let step;

  if (options === undefined || options === null) {
    step = undefined;
  } else if (typeof options === 'object') {
    step = options.step;
    inclusiveEnd = Boolean(options.inclusive);
  } else if (isNum(options)) {
    step = options;
  } else {
    throw new TypeError();
  }

  if (Number.isNaN(step)) {
    throw new RangeError();
  }

  if (step === undefined || step === null) {
    step = ifIncrease ? 1 : -1;
  }

  if (typeof step !== 'number') {
    throw new TypeError();
  }

  if (isInfinity(step)) {
    throw RangeError();
  }

  if (step === 0 && start !== end) {
    throw new RangeError();
  }

  const arr: number[] = [];
  const ifStepIncrease = step > 0;

  if (ifIncrease !== ifStepIncrease) {
    return arr;
  }

  let hitsEnd = false;
  let curCount = 0;

  while (hitsEnd === false) {
    const val = start + step * curCount;

    if (val === end) {
      hitsEnd = true;
    }

    curCount = curCount + 1;
    let endCondition = false;

    if (ifIncrease) {
      endCondition = inclusiveEnd ? val > end : val >= end;
    } else {
      endCondition = inclusiveEnd ? end > val : end >= val;
    }

    if (endCondition) {
      return arr;
    }

    arr.push(val);
  }

  return arr;
}
