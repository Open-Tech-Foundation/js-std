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
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastInvokeTime = 0;

  const leading = options.leading ?? true;
  const trailing = options.trailing ?? true;

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
