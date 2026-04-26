import { timeoutRun } from '../../src';

describe('timeoutRun', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('resolves if within timeout', async () => {
    const func = async () => 'ok';
    const result = await timeoutRun(func, 1000);
    expect(result).toBe('ok');
  });

  test('rejects if timeout exceeded', async () => {
    const func = () => new Promise(resolve => setTimeout(() => resolve('too late'), 2000));

    const result = timeoutRun(func, 1000);
    result.catch(() => {});
    vi.advanceTimersByTime(1000);
    
    await expect(result).rejects.toThrow('Operation timed out after 1000ms');
  });

  test('custom error message', async () => {
    const func = () => new Promise(resolve => setTimeout(resolve, 2000));

    const result = timeoutRun(func, 1000, { message: 'Custom timeout' });
    result.catch(() => {});
    vi.advanceTimersByTime(1000);
    
    await expect(result).rejects.toThrow('Custom timeout');
  });

  test('fallback value', async () => {
    const func = () => new Promise(resolve => setTimeout(() => resolve('real'), 2000));

    const result = timeoutRun(func, 1000, { fallback: 'fallback' });
    vi.advanceTimersByTime(1000);
    
    expect(await result).toBe('fallback');
  });
});
