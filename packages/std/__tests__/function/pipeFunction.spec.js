import { pipeFunction } from '../../src';

describe('Function > pipeFunction', () => {
  test('empty pipe', () => {
    const fn = pipeFunction();
    expect(typeof fn).toBe('function');
    expect(fn()).toBe(undefined);
  });

  test('single args pipe fn with single function', () => {
    const fn = pipeFunction(Math.abs);
    expect(typeof fn).toBe('function');
    expect(fn(-5)).toBe(5);
  });

  test('two args pipe fn with single function', () => {
    const fn = pipeFunction(Math.pow);
    expect(typeof fn).toBe('function');
    expect(fn(2, 3)).toBe(8);
  });

  test('multiple args pipe fn with single function', () => {
    const fn = pipeFunction(Math.max);
    expect(typeof fn).toBe('function');
    expect(fn(2, 3, 5)).toBe(5);
  });

  test('single args pipe fn with two functions', () => {
    const fn = pipeFunction(Math.abs, Math.ceil);
    expect(typeof fn).toBe('function');
    expect(fn(-1.235)).toBe(2);
  });
});
