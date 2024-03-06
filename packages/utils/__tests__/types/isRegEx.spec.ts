import { isRegEx } from '../../src';

describe('Types > isRegEx', () => {
  test('invalid cases', () => {
    expect(isRegEx({})).toBe(false);
    expect(isRegEx('/a/')).toBe(false);
  });

  test('valid cases', () => {
    expect(isRegEx(new RegExp())).toBe(true);
    expect(isRegEx(/a/)).toBe(true);
  });
});
