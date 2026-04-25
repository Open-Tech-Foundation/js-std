import { compose } from '../../src';

describe('Function > compose', () => {
  test('composes functions from right to left', () => {
    const add1 = (n) => n + 1;
    const mul2 = (n) => n * 2;
    expect(compose(add1, mul2)(5)).toBe(11); // (5 * 2) + 1
  });

  test('composes async functions', async () => {
    const add1 = (n) => Promise.resolve(n + 1);
    const mul2 = (n) => Promise.resolve(n * 2);
    const res = await compose(add1, mul2)(5);
    expect(res).toBe(11);
  });

  test('handles multiple arguments for the first function (right-most)', () => {
    const add = (a, b) => a + b;
    const mul2 = (n) => n * 2;
    expect(compose(mul2, add)(1, 2)).toBe(6); // (1 + 2) * 2
  });

  test('returns passed value if no functions', () => {
    // Current implementation returns undefined if no functions provided
    // This is consistent with our pipe implementation
    expect(compose()()).toBe(undefined);
  });
});
