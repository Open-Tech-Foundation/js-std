import validateFlowNumber from './validateFlowNumber';

export interface PaceRunOptions {
  /** Invoke on the leading edge of the interval. Defaults to `true`. */
  leading?: boolean;
  /** Invoke on the trailing edge of the interval. Defaults to `true`. */
  trailing?: boolean;
}

/** The throttled function returned by {@link paceRun}. */
export interface PaceRunFn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  /** Discards the pending invocation, if there is one. */
  cancel: () => void;
  /** Invokes the pending call immediately. */
  flush: () => void;
  /** Whether an invocation is currently waiting to run. */
  pending: () => boolean;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `interval` milliseconds.
 *
 * @example
 * const run = paceRun((val) => console.log(val), 500);
 * run('a');
 * run('b');
 * // => logs 'a' immediately, ignores 'b'
 */
export default function paceRun<T extends (...args: any[]) => any>(
  func: T,
  interval = 0,
  options: PaceRunOptions = {},
): PaceRunFn<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastInvokeTime = 0;

  const leading = options.leading ?? true;
  const trailing = options.trailing ?? true;

  validateFlowNumber(interval, 'Interval', { min: 0 });

  function invoke(time: number) {
    const args = lastArgs!;
    lastArgs = undefined;
    lastInvokeTime = time;
    func(...args);
  }

  function startTimer() {
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      if (trailing && lastArgs) {
        invoke(Date.now());
        startTimer();
      }
    }, interval);
  }

  function throttled(...args: Parameters<T>) {
    const time = Date.now();
    if (lastInvokeTime === 0 && !leading) {
      lastInvokeTime = time;
    }

    const remaining = interval - (time - lastInvokeTime);
    lastArgs = args;

    if (remaining <= 0 || remaining > interval) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      invoke(time);
    } else if (!timeoutId && trailing) {
      startTimer();
    }
  }

  throttled.cancel = () => {
    clearTimeout(timeoutId);
    lastInvokeTime = 0;
    timeoutId = lastArgs = undefined;
  };

  throttled.flush = () => {
    if (timeoutId !== undefined) {
      if (lastArgs) {
        invoke(Date.now());
      }
      throttled.cancel();
    }
  };

  throttled.pending = () => timeoutId !== undefined;

  return throttled;
}
