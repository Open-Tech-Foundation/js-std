import { isFn } from '../../src';

describe('Types > isFn', () => {
  test('invalid cases', () => {
    expect(isFn()).toBe(false);
    expect(isFn({})).toBe(false);
  });

  test('valid cases', () => {
    expect(isFn(() => {})).toBe(true);
    expect(isFn(function () {})).toBe(true);
    expect(isFn(async function () {})).toBe(true);
    expect(isFn(function* () {})).toBe(true);
  });
});
