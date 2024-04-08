import { aPipeFn, capitalize } from '../../src';

describe('Function > Pipe', () => {
  test('empty aPipeFn', async () => {
    const fn = aPipeFn();
    expect(typeof fn).toBe('function');
    await expect(fn()).resolves.toBe(undefined);
  });

  test('returns undefined value if no functions', async () => {
    const fn = aPipeFn();
    expect(typeof fn).toBe('function');
    await expect(fn(1)).resolves.toBe(undefined);
  });

  test('single functions', async () => {
    const fn = aPipeFn((x) => Promise.resolve(Math.abs(x)));
    await expect(fn(-1)).resolves.toBe(1);
  });

  test('two functions', async () => {
    const fn = aPipeFn(
      (s) => capitalize(s),
      (x) => new Promise((resolve) => resolve(`Welcome ${x}`))
    );
    expect(typeof fn).toBe('function');
    await expect(fn('guest')).resolves.toBe('Welcome Guest');
  });

  test('multiple functions', async () => {
    const fn = aPipeFn(
      (s) => capitalize(s),
      (x) => new Promise((resolve) => resolve(`Welcome ${x}`)),
      (x) => new Promise((resolve) => resolve(`${x}...`))
    );
    expect(typeof fn).toBe('function');
    await expect(fn('guest')).resolves.toBe('Welcome Guest...');
  });
});
