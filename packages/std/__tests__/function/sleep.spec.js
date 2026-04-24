import { sleep } from '../../src';

describe('Function', () => {
  test('sleep', async () => {
    await expect(sleep()).resolves.toBeUndefined();
    await expect(sleep(0)).resolves.toBeUndefined();
    await expect(sleep(10)).resolves.toBeUndefined();
  });
});
