import { isErr } from '../../src';

describe('Types > isErr', () => {
  test('invalid cases', () => {
    expect(isErr()).toBe(false);
    expect(isErr({})).toBe(false);
  });

  test('valid cases', () => {
    expect(isErr(new Error())).toBe(true);
    expect(isErr(new Error('error msg'))).toBe(true);
    expect(isErr(Error('error msg'))).toBe(true);
  });
});
