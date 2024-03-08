import { odd } from '../../src';

describe('Number', () => {
  test('odd', () => {
    expect(odd(0)).toBe(false);
    expect(odd(1)).toBe(true);
    expect(odd(2)).toBe(false);
    expect(odd(-1)).toBe(true);
    expect(odd(-2)).toBe(false);
    expect(odd(-3)).toBe(true);
    expect(odd(-4)).toBe(false);
    expect(odd(-5)).toBe(true);
  });
});
