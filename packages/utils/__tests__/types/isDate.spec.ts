import { isDate } from '../../src';

describe('Types > isDate', () => {
  test('invalid cases', () => {
    expect(isDate()).toBe(false);
    expect(isDate(null)).toBe(false);
    expect(isDate('abc')).toBe(false);
    expect(isDate(123)).toBe(false);
    expect(isDate({})).toBe(false);
    expect(isDate([])).toBe(false);
    expect(isDate(new Date(''))).toBe(false);
    expect(isDate(new Date('2000-13-01'))).toBe(false);
  });

  test('valid cases', () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date('2000-01-01'))).toBe(true);
  });
});
