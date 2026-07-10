import { mapKeys, mapValues, omitBy, pick, pickBy } from '../../src';

describe('Object > null-prototype transforms', () => {
  test('pick preserves null-prototype containers', () => {
    const nested = Object.create(null) as Record<string, unknown>;
    nested.b = 2;

    const input = Object.create(null) as Record<string, unknown>;
    input.a = nested;

    const out = pick(input, 'a.b') as Record<string, unknown>;
    const outA = out.a as Record<string, unknown>;

    expect(Object.getPrototypeOf(out)).toBe(null);
    expect(Object.getPrototypeOf(outA)).toBe(null);
    expect(out).toEqual({ a: { b: 2 } });
  });

  test('pickBy preserves null-prototype objects', () => {
    const input = Object.create(null) as Record<string, unknown>;
    input.a = 1;
    input.b = 'x';

    const out = pickBy(input, (value) => typeof value === 'number');

    expect(Object.getPrototypeOf(out)).toBe(null);
    expect(out).toEqual({ a: 1 });
  });

  test('omitBy preserves null-prototype objects', () => {
    const input = Object.create(null) as Record<string, unknown>;
    input.a = 1;
    input.b = 'x';

    const out = omitBy(input, (value) => typeof value === 'number');

    expect(Object.getPrototypeOf(out)).toBe(null);
    expect(out).toEqual({ b: 'x' });
  });

  test('mapKeys preserves null-prototype objects', () => {
    const input = Object.create(null) as Record<string, unknown>;
    input.a = 1;

    const out = mapKeys(input, (value, key) => `${key}${value}`);

    expect(Object.getPrototypeOf(out)).toBe(null);
    expect(out).toEqual({ a1: 1 });
  });

  test('mapValues preserves null-prototype objects', () => {
    const input = Object.create(null) as Record<string, unknown>;
    input.a = 1;

    const out = mapValues(input, (value) => (value as number) * 2);

    expect(Object.getPrototypeOf(out)).toBe(null);
    expect(out).toEqual({ a: 2 });
  });
});
