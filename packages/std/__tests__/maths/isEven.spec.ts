import { isEven } from '../../src';

describe('Number', () => {
  test('isEven', () => {
    expect(isEven(0)).toBe(true);
    expect(isEven(1)).toBe(false);
    expect(isEven(2)).toBe(true);
    expect(isEven(-1)).toBe(false);
    expect(isEven(-2)).toBe(true);
  });
});
