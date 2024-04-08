import { aPipe, capitalize } from '../../src';

describe('Function > Pipe', () => {
  test('empty aPipe', async () => {
    await expect(aPipe()).resolves.toBe(undefined);
  });

  test('returns passed value if no functions', async () => {
    await expect(aPipe(1)).resolves.toBe(1);
  });

  test('single functions', async () => {
    await expect(aPipe(-1, Math.abs)).resolves.toBe(1);
  });

  test('two functions', async () => {
    await expect(
      aPipe(
        'guest',
        (s) => capitalize(s),
        (x) => new Promise((resolve) => resolve(`Welcome ${x}`))
      )
    ).resolves.toBe('Welcome Guest');
  });

  test('multiple functions', async () => {
    await expect(
      aPipe(
        'guest',
        (s) => capitalize(s),
        (x) => new Promise((resolve) => resolve(`Welcome ${x}`)),
        (x) => new Promise((resolve) => resolve(`${x}...`))
      )
    ).resolves.toBe('Welcome Guest...');
  });
});
