import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import { timeoutRun } from '../../src';

describe('timeoutRun', () => {
  beforeEach(() => {
    clock.freeze();
  });

  afterEach(() => {
    clock.release();
  });

  test('resolves if within timeout', async () => {
    const func = async () => 'ok';
    const result = await timeoutRun(func, 1000);
    expect(result).toBe('ok');
  });

  test('rejects if timeout exceeded', async () => {
    const func = () =>
      new Promise((resolve) => setTimeout(() => resolve('too late'), 2000));

    const result = timeoutRun(func, 1000);
    result.catch(() => {});
    clock.advance(1000);

    await expect(result).rejects.toThrow('Operation timed out after 1000ms');
  });

  test('custom error message', async () => {
    const func = () => new Promise((resolve) => setTimeout(resolve, 2000));

    const result = timeoutRun(func, 1000, { message: 'Custom timeout' });
    result.catch(() => {});
    clock.advance(1000);

    await expect(result).rejects.toThrow('Custom timeout');
  });

  test('fallback value', async () => {
    const func = () =>
      new Promise((resolve) => setTimeout(() => resolve('real'), 2000));

    const result = timeoutRun(func, 1000, { fallback: 'fallback' });
    clock.advance(1000);

    expect(await result).toBe('fallback');
  });

  test('throws on invalid timeout values', async () => {
    await expect(timeoutRun(async () => 'ok', -1)).rejects.toThrow(
      'Timeout must be greater than or equal to 0.',
    );
    await expect(timeoutRun(async () => 'ok', Number.NaN)).rejects.toThrow(
      'Timeout must be a finite number.',
    );
    await expect(
      timeoutRun(async () => 'ok', Number.POSITIVE_INFINITY),
    ).rejects.toThrow('Timeout must be a finite number.');
  });
});
