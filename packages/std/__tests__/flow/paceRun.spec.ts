import { paceRun } from '../../src';

describe('paceRun', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('throttles calls', () => {
    const func = vi.fn();
    const throttled = paceRun(func, 100);

    throttled('a');
    throttled('b');
    throttled('c');

    expect(func).toBeCalledWith('a');
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    // Trailing is true by default
    expect(func).toBeCalledWith('c');
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('leading: false', () => {
    const func = vi.fn();
    const throttled = paceRun(func, 100, { leading: false });

    throttled('a');
    expect(func).not.toBeCalled();

    vi.advanceTimersByTime(100);
    expect(func).toBeCalledWith('a');
  });

  test('trailing: false', () => {
    const func = vi.fn();
    const throttled = paceRun(func, 100, { trailing: false });

    throttled('a');
    throttled('b');
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
    
    throttled('c');
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toBeCalledWith('c');
  });

  test('cancel method', () => {
    const func = vi.fn();
    const throttled = paceRun(func, 100);

    throttled('a');
    throttled('b');
    throttled.cancel();
    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).not.toBeCalledWith('b');
  });
});
