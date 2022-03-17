import { sleep } from '../../lib/index.esm.js';

describe('Timers', () => {
  test('sleep', async () => {
    await expect(sleep()).resolves.not.toThrow();
    await expect(sleep(0)).resolves.not.toThrow();
    await expect(sleep(10)).resolves.not.toThrow();
    await expect(sleep(100)).resolves.not.toThrow();
    await expect(sleep(1000)).resolves.not.toThrow();
  });
});
