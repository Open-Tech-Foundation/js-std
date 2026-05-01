import { isBrowser, isBun, isDeno, isNode } from '../../src';

describe('Types', () => {
  test('isNode', () => {
    expect(typeof isNode()).toBe('boolean');
  });

  test('isBrowser', () => {
    expect(typeof isBrowser()).toBe('boolean');
  });

  test('isDeno', () => {
    expect(typeof isDeno()).toBe('boolean');
  });

  test('isBun', () => {
    expect(typeof isBun()).toBe('boolean');
    expect(isBun()).toBe(true);
    expect(isNode()).toBe(false);
    expect(isBrowser()).toBe(false);
    expect(isDeno()).toBe(false);
  });
});
