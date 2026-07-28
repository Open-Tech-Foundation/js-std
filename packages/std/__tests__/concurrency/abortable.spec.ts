import { abortable, sleep, withResolvers } from '../../src';

describe('abortable', () => {
  test('resolves with the original value when never aborted', async () => {
    const controller = new AbortController();

    await expect(
      abortable(Promise.resolve('value'), controller.signal),
    ).resolves.toBe('value');
  });

  test('propagates the original rejection when never aborted', async () => {
    const controller = new AbortController();
    const error = new Error('original');

    await expect(
      abortable(Promise.reject(error), controller.signal),
    ).rejects.toBe(error);
  });

  test('rejects as soon as the signal aborts', async () => {
    const controller = new AbortController();
    const reason = new Error('cancelled');

    const { promise } = withResolvers<string>();
    setTimeout(() => controller.abort(reason), 10);

    await expect(abortable(promise, controller.signal)).rejects.toBe(reason);
  });

  test('rejects immediately when the signal is already aborted', async () => {
    const controller = new AbortController();
    const reason = new Error('cancelled');
    controller.abort(reason);

    const { promise } = withResolvers<string>();

    await expect(abortable(promise, controller.signal)).rejects.toBe(reason);
  });

  test('lets a promise that settles first win the race', async () => {
    const controller = new AbortController();

    const result = abortable(
      sleep(5).then(() => 'done'),
      controller.signal,
    );

    await expect(result).resolves.toBe('done');

    // Aborting afterwards must not throw or change the settled result.
    controller.abort();
    await expect(result).resolves.toBe('done');
  });

  test('does not surface a late rejection as an unhandled rejection', async () => {
    const controller = new AbortController();
    const { promise, reject } = withResolvers<string>();

    const result = abortable(promise, controller.signal);
    controller.abort();

    await expect(result).rejects.toThrow();

    // The original promise rejects only after the abort already settled ours.
    reject(new Error('too late'));
    await sleep(10);
  });

  test('does not cancel the underlying work', async () => {
    const controller = new AbortController();
    let completed = false;

    const work = sleep(20).then(() => {
      completed = true;
      return 'done';
    });

    controller.abort();
    await expect(abortable(work, controller.signal)).rejects.toThrow();

    expect(completed).toBe(false);

    // The operation was never cancelled — it simply stopped being awaited.
    await work;
    expect(completed).toBe(true);
  });

  test('pairs with a signal passed into the operation itself', async () => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10);

    // Here the work does observe the signal, so it stops too.
    const work = sleep(5000, { signal: controller.signal });

    await expect(abortable(work, controller.signal)).rejects.toThrow();
  });
});
