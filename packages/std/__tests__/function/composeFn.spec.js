import { composeFn } from '../../src';

describe('Function > composeFn', () => {
  test('empty compose', () => {
    const fn = composeFn();
    expect(typeof fn).toBe('function');
    expect(fn()).toBe(undefined);
  });

  test('single args compose fn with single function', () => {
    const fn = composeFn(Math.abs);
    expect(typeof fn).toBe('function');
    expect(fn(-5)).toBe(5);
  });

  test('two args compose fn with single function', () => {
    const fn = composeFn(Math.pow);
    expect(typeof fn).toBe('function');
    expect(fn(2, 3)).toBe(8);
  });

  test('multiple args compose fn with single function', () => {
    const fn = composeFn(Math.max);
    expect(typeof fn).toBe('function');
    expect(fn(2, 3, 5)).toBe(5);
  });

  test('single args compose fn with two functions', () => {
    const fn = composeFn(Math.abs, Math.ceil);
    expect(typeof fn).toBe('function');
    expect(fn(-1.235)).toBe(1);
  });
});
