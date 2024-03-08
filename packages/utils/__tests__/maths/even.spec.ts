import { even } from '../../src';

describe('Number', () => {
  test('even', () => {
    expect(even(0)).toBe(true);
    expect(even(1)).toBe(false);
    expect(even(2)).toBe(true);
    expect(even(-1)).toBe(false);
    expect(even(-2)).toBe(true);
  });
});
