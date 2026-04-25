import { composeFunction } from '../../src';

describe('Function > composeFunction', () => {
  test('empty compose', () => {
    const fn = composeFunction();
    expect(typeof fn).toBe('function');
    expect(fn()).toBe(undefined);
  });

  test('single args compose fn with single function', () => {
    const fn = composeFunction(Math.abs);
    expect(typeof fn).toBe('function');
    expect(fn(-5)).toBe(5);
  });

  test('two args compose fn with single function', () => {
    const fn = composeFunction(Math.pow);
    expect(typeof fn).toBe('function');
    expect(fn(2, 3)).toBe(8);
  });

  test('multiple args compose fn with single function', () => {
    const fn = composeFunction(Math.max);
    expect(typeof fn).toBe('function');
    expect(fn(2, 3, 5)).toBe(5);
  });

  test('single args compose fn with two functions', () => {
    const fn = composeFunction(Math.abs, Math.ceil);
    expect(typeof fn).toBe('function');
    expect(fn(-1.235)).toBe(1);
  });
});
