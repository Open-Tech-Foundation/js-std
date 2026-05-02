import { pipe } from '../../src';

describe('pipe', () => {
  test('pipes functions from left to right', () => {
    const add1 = (n) => n + 1;
    const mul2 = (n) => n * 2;
    expect(pipe(add1, mul2)(5)).toBe(12);
  });

  test('pipes async functions from left to right', async () => {
    const add1 = (n) => Promise.resolve(n + 1);
    const mul2 = (n) => Promise.resolve(n * 2);
    const res = await pipe(add1, mul2)(5);
    expect(res).toBe(12);
  });

  test('pipes mixed sync and async functions', async () => {
    const add1 = (n) => n + 1;
    const mul2 = (n) => Promise.resolve(n * 2);
    const res = await pipe(add1, mul2)(5);
    expect(res).toBe(12);
  });

  test('handles multiple arguments for the first function', () => {
    const add = (a, b) => a + b;
    const mul2 = (n) => n * 2;
    expect(pipe(add, mul2)(1, 2)).toBe(6);
  });
});
