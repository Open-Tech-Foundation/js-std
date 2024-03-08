import { isAsyFn } from '../../src';

describe('Types > isAsyFn', () => {
  test('invalid cases', () => {
    expect(isAsyFn()).toBe(false);
    expect(isAsyFn({})).toBe(false);
    expect(isAsyFn(() => {})).toBe(false);
    expect(isAsyFn(function () {})).toBe(false);
    expect(isAsyFn(function* () {})).toBe(false);
  });

  test('valid cases', () => {
    expect(isAsyFn(async function () {})).toBe(true);
    expect(isAsyFn(async function* () {})).toBe(true);
  });
});
