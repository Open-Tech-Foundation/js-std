import { isNull } from '../../src';

describe('Types > isNull', () => {
  test('invalid cases', () => {
    expect(isNull(undefined)).toBe(false);
    expect(isNull('')).toBe(false);
    expect(isNull(0)).toBe(false);
    expect(isNull(false)).toBe(false);
  });

  test('valid cases', () => {
    expect(isNull(null)).toBe(true);
  });
});
