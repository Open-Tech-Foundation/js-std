import { pipe } from '../../src';

describe('Function > Pipe', () => {
  test('empty pipe', () => {
    expect(pipe()).toBe(undefined);
  });

  test('returns passed value if no functions', () => {
    expect(pipe(1)).toBe(1);
  });

  test('single functions', () => {
    expect(pipe(-1, Math.abs)).toBe(1);
  });

  test('two functions', () => {
    expect(pipe(-4, Math.abs, Math.sqrt)).toBe(2);
  });

  test('multiple functions', () => {
    expect(
      pipe(
        1,
        (x) => x + 1,
        (x) => x * 5
      )
    ).toBe(10);
  });
});
