import { idleRun } from '../../src';

describe('idleRun', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('debounces calls', () => {
    const func = vi.fn();
    const debounced = idleRun(func, 100);

    debounced('a');
    debounced('b');
    debounced('c');

    expect(func).not.toBeCalled();

    vi.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    vi.advanceTimersByTime(50);
    expect(func).toBeCalledWith('c');
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('leading option', () => {
    const func = vi.fn();
    const debounced = idleRun(func, 100, { leading: true });

    debounced('a');
    expect(func).toBeCalledWith('a');

    debounced('b');
    vi.advanceTimersByTime(100);
    expect(func).toBeCalledWith('b');
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('maxWait option', () => {
    const func = vi.fn();
    const debounced = idleRun(func, 100, { maxWait: 200 });

    debounced('a');
    vi.advanceTimersByTime(50);
    debounced('b');
    vi.advanceTimersByTime(50);
    debounced('c');
    vi.advanceTimersByTime(50);
    debounced('d');
    
    // maxWait is 200ms from the first call
    vi.advanceTimersByTime(50);
    expect(func).toBeCalledWith('d');
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('cancel method', () => {
    const func = vi.fn();
    const debounced = idleRun(func, 100);

    debounced('a');
    debounced.cancel();
    vi.advanceTimersByTime(100);
    expect(func).not.toBeCalled();
  });

  test('flush method', () => {
    const func = vi.fn();
    const debounced = idleRun(func, 100);

    debounced('a');
    debounced.flush();
    expect(func).toBeCalledWith('a');
    expect(debounced.pending()).toBe(false);
  });
});
