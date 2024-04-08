import { aComposeFn } from '../../src';

describe('Function > aComposeFn', () => {
  test('empty compose', async () => {
    const fn = aComposeFn();
    expect(typeof fn).toBe('function');
    await expect(fn()).resolves.toBe(undefined);
  });

  test('single args compose fn with single function', async () => {
    const fn = aComposeFn(Math.abs);
    expect(typeof fn).toBe('function');
    await expect(fn(-5)).resolves.toBe(5);
  });

  test('two args compose fn with single function', async () => {
    const fn = aComposeFn(Math.pow);
    expect(typeof fn).toBe('function');
    await expect(fn(2, 3)).resolves.toBe(8);
  });

  test('multiple args compose fn with single function', async () => {
    const fn = aComposeFn(Math.max);
    expect(typeof fn).toBe('function');
    await expect(fn(2, 3, 5)).resolves.toBe(5);
  });

  test('single args compose fn with two functions', async () => {
    const fn = aComposeFn(
      (x) => Promise.resolve(Math.ceil(x)),
      (x) => Promise.resolve(Math.abs(x))
    );
    expect(typeof fn).toBe('function');
    await expect(fn(-1.235)).resolves.toBe(2);
  });
});
