import { compose } from '../../src';

describe('Function > compose', () => {
  test('empty compose', () => {
    expect(compose()).toBe(undefined);
  });

  test('returns passed value if no functions', () => {
    expect(compose(1)).toBe(1);
  });

  test('single functions', () => {
    expect(compose(-1, Math.abs)).toBe(1);
  });

  test('two functions', () => {
    expect(compose(-4, Math.sqrt, Math.abs)).toBe(2);
  });

  test('multiple functions', () => {
    expect(
      compose(
        1,
        (x) => x + 1,
        (x) => x * 5
      )
    ).toBe(6);
  });
});
