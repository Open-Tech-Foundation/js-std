import { isBool } from '../../src';

describe('Types > isBool', () => {
  test('invalid cases', () => {
    expect(isBool()).toBe(false);
    expect(isBool(null)).toBe(false);
    expect(isBool('')).toBe(false);
    expect(isBool(1)).toBe(false);
    expect(isBool(0)).toBe(false);
    expect(isBool('true')).toBe(false);
    expect(isBool('false')).toBe(false);
    expect(isBool('null')).toBe(false);
  });

  test('valid cases', () => {
    expect(isBool(true)).toBe(true);
    expect(isBool(false)).toBe(true);
  });
});
