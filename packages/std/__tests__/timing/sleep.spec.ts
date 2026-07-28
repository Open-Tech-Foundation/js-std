import { sleep } from '../../src';

describe('Function', () => {
  test('sleep', async () => {
    await expect(sleep()).resolves.toBeUndefined();
    await expect(sleep(0)).resolves.toBeUndefined();
    await expect(sleep(10)).resolves.toBeUndefined();
  });
});

describe('sleep with a signal', () => {
  test('resolves normally when the signal never aborts', async () => {
    const controller = new AbortController();

    await expect(
      sleep(10, { signal: controller.signal }),
    ).resolves.toBeUndefined();
  });

  test('rejects when aborted mid-sleep', async () => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10);

    await expect(sleep(5000, { signal: controller.signal })).rejects.toThrow();
  });

  test('rejects immediately when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    const started = Date.now();
    await expect(sleep(5000, { signal: controller.signal })).rejects.toThrow();

    // The timer was never started, so this must not have waited.
    expect(Date.now() - started).toBeLessThan(1000);
  });

  test('rejects with the signal reason', async () => {
    const controller = new AbortController();
    const reason = new Error('cancelled');
    controller.abort(reason);

    await expect(sleep(5000, { signal: controller.signal })).rejects.toBe(
      reason,
    );
  });

  test('rejects with the reason when aborted mid-sleep', async () => {
    const controller = new AbortController();
    const reason = new Error('too slow');
    setTimeout(() => controller.abort(reason), 10);

    await expect(sleep(5000, { signal: controller.signal })).rejects.toBe(
      reason,
    );
  });

  test('aborting after the sleep resolved changes nothing', async () => {
    const controller = new AbortController();

    await expect(
      sleep(5, { signal: controller.signal }),
    ).resolves.toBeUndefined();

    // The listener must already be detached, so this must not throw.
    controller.abort();
  });

  test('rejects without waiting out the remaining time', async () => {
    const controller = new AbortController();
    const started = Date.now();
    const promise = sleep(1000, { signal: controller.signal });

    controller.abort();

    await expect(promise).rejects.toThrow();
    expect(Date.now() - started).toBeLessThan(500);
  });
});
