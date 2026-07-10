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
    const sym = Symbol('pickBy');
    const input = Object.create(null) as Record<string, unknown>;
    input.a = 1;
    input.b = 'x';
    (input as Record<string | symbol, unknown>)[sym] = 2;

    const out = pickBy(input, (value) => typeof value === 'number');

    expect(Object.getPrototypeOf(out)).toBe(null);
    expect(out).toMatchObject({ a: 1 });
    expect((out as Record<string | symbol, unknown>)[sym]).toBe(2);
  });

  test('omitBy preserves null-prototype objects', () => {
    const sym = Symbol('omitBy');
    const input = Object.create(null) as Record<string, unknown>;
    input.a = 1;
    input.b = 'x';
    (input as Record<string | symbol, unknown>)[sym] = 2;

    const out = omitBy(input, (value) => typeof value === 'number');

    expect(Object.getPrototypeOf(out)).toBe(null);
    expect(out).toEqual({ b: 'x' });
    expect((out as Record<string | symbol, unknown>)[sym]).toBeUndefined();
  });

  test('mapKeys preserves null-prototype objects', () => {
    const sym = Symbol('mapKeys');
    const nextSym = Symbol('mapped');
    const input = Object.create(null) as Record<string, unknown>;
    input.a = 1;
    (input as Record<string | symbol, unknown>)[sym] = 2;

    const out = mapKeys(input, (value, key) =>
      key === sym ? nextSym : `${String(key)}${value}`,
    );

    expect(Object.getPrototypeOf(out)).toBe(null);
    expect(out).toMatchObject({ a1: 1 });
    expect((out as Record<string | symbol, unknown>)[nextSym]).toBe(2);
  });

  test('mapValues preserves null-prototype objects', () => {
    const sym = Symbol('mapValues');
    const input = Object.create(null) as Record<string, unknown>;
    input.a = 1;
    (input as Record<string | symbol, unknown>)[sym] = 2;

    const out = mapValues(input, (value) => (value as number) * 2);

    expect(Object.getPrototypeOf(out)).toBe(null);
    expect(out).toMatchObject({ a: 2 });
    expect((out as Record<string | symbol, unknown>)[sym]).toBe(4);
  });
});
