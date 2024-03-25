import { isPromise } from '../../src';

describe('Types > isPromise', () => {
  test('invalid cases', () => {
    expect(isPromise()).toBe(false);
    expect(isPromise(undefined)).toBe(false);
    expect(isPromise(null)).toBe(false);
    expect(isPromise(false)).toBe(false);
    expect(isPromise('')).toBe(false);
    expect(isPromise('then')).toBe(false);
    expect(isPromise(0)).toBe(false);
    expect(isPromise(1)).toBe(false);
    expect(isPromise({})).toBe(false);
    expect(isPromise({ then: true })).toBe(false);
    expect(isPromise([])).toBe(false);
    expect(isPromise(['then'])).toBe(false);
  });

  test('valid cases', () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise(Promise.all([]))).toBe(true);
    expect(isPromise(Promise.race([]))).toBe(true);
    expect(isPromise(Promise.allSettled([]))).toBe(true);
    expect(isPromise({ then: function () {} })).toBe(true);
  });
});
