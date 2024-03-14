import { noop } from '../../src';

describe('Function', () => {
  test('noop', () => {
    expect(noop()).toBe(undefined);
    expect(noop(null)).toBe(undefined);
    expect(noop(1)).toBe(undefined);
  });
});
