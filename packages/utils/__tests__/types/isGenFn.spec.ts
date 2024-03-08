import { isGenFn } from '../../src';

describe('Types > isGenFn', () => {
  test('invalid cases', () => {
    expect(isGenFn()).toBe(false);
    expect(isGenFn({})).toBe(false);
    expect(isGenFn(() => {})).toBe(false);
    expect(isGenFn(function () {})).toBe(false);
    expect(isGenFn(async function () {})).toBe(false);
  });

  test('valid cases', () => {
    expect(isGenFn(function* () {})).toBe(true);
    expect(isGenFn(async function* () {})).toBe(true);
  });
});
