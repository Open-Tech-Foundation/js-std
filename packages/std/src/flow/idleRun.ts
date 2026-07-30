import validateFlowNumber from './validateFlowNumber';

export interface IdleRunOptions {
  /** Invoke on the leading edge of the delay. Defaults to `false`. */
  leading?: boolean;
  /** Invoke on the trailing edge of the delay. Defaults to `true`. */
  trailing?: boolean;
  /** The longest `func` may be held back before it is invoked regardless. */
  maxWait?: number;
}

/** The debounced function returned by {@link idleRun}. */
export interface IdleRunFn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  /** Discards the pending invocation, if there is one. */
  cancel: () => void;
  /** Invokes the pending call immediately. */
  flush: () => void;
  /** Whether an invocation is currently waiting to run. */
  pending: () => boolean;
}

/**
 * Creates a debounced function that delays invoking `func` until after `delay` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @example
 * const run = idleRun((val) => console.log(val), 500);
 * run('a');
 * run('b');
 * // => logs 'b' after 500ms
 */
export default function idleRun<T extends (...args: any[]) => any>(
  func: T,
  delay = 0,
  options: IdleRunOptions = {},
): IdleRunFn<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let maxWaitId: ReturnType<typeof setTimeout> | undefined;

  const leading = options.leading ?? false;
  const trailing = options.trailing ?? true;
  const maxWait = options.maxWait;

  validateFlowNumber(delay, 'Delay', { min: 0 });
  if (maxWait !== undefined) {
    validateFlowNumber(maxWait, 'maxWait', { min: 0 });
  }

  function invoke(time: number) {
    const args = lastArgs!;
    lastArgs = undefined;
    lastInvokeTime = time;
    func(...args);
  }

  function startTimer(time: number) {
    timeoutId = setTimeout(() => {
      if (trailing && lastArgs) {
        invoke(Date.now());
      }
      timeoutId = undefined;
    }, delay);
  }

  function debounced(...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = timeoutId === undefined;

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (leading) {
        invoke(time);
      }
      startTimer(time);
    } else {
      clearTimeout(timeoutId);
      startTimer(time);
    }

    if (maxWait !== undefined && maxWaitId === undefined) {
      maxWaitId = setTimeout(() => {
        if (lastArgs) {
          invoke(Date.now());
        }
        maxWaitId = undefined;
      }, maxWait);
    }
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    clearTimeout(maxWaitId);
    timeoutId = maxWaitId = lastArgs = lastCallTime = undefined;
  };

  debounced.flush = () => {
    if (timeoutId !== undefined || maxWaitId !== undefined) {
      if (lastArgs) {
        invoke(Date.now());
      }
      debounced.cancel();
    }
  };

  debounced.pending = () => timeoutId !== undefined || maxWaitId !== undefined;

  return debounced;
}
