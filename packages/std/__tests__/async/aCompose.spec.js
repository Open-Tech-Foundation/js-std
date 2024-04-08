import { aCompose } from '../../src';

describe('Function > aCompose', () => {
  test('empty aCompose', async () => {
    await expect(aCompose()).resolves.toBe(undefined);
  });

  test('single functions', async () => {
    await expect(aCompose(-5, Math.abs)).resolves.toBe(5);
  });

  test('two functions', async () => {
    await expect(aCompose(-4, Math.sqrt, Math.abs)).resolves.toBe(2);
  });

  test('multiple functions', async () => {
    await expect(
      aCompose(
        1,
        (x) => Promise.resolve(x + 1),
        (x) => Promise.resolve(x * 5)
      )
    ).resolves.toBe(6);
  });
});
