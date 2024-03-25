import { isBigInt } from '../../src';

describe('Types > isBigInt', () => {
  test('invalid cases', () => {
    expect(isBigInt()).toBe(false);
    expect(isBigInt(null)).toBe(false);
    expect(isBigInt(1)).toBe(false);
  });

  test('valid cases', () => {
    expect(isBigInt(1n)).toBe(true);
  });
});
