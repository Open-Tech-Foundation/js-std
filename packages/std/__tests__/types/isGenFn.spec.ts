import { isGenFn } from '../../src';

describe('Types > isGenFn', () => {
  test('invalid cases', () => {
    expect(isGenFn()).toBe(false);
    expect(isGenFn({})).toBe(false);
    expect(isGenFn(() => {})).toBe(false);
    expect(isGenFn(() => {})).toBe(false);
    expect(isGenFn(async () => {})).toBe(false);
  });

  test('valid cases', () => {
    expect(isGenFn(function* () {})).toBe(true);
    expect(isGenFn(async function* () {})).toBe(true);
  });
});
