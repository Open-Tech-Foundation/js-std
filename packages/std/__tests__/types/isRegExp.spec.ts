import { isRegExp } from '../../src';

describe('Types > isRegExp', () => {
  test('invalid cases', () => {
    expect(isRegExp({})).toBe(false);
    expect(isRegExp('/a/')).toBe(false);
  });

  test('valid cases', () => {
    expect(isRegExp(new RegExp())).toBe(true);
    expect(isRegExp(/a/)).toBe(true);
  });
});
