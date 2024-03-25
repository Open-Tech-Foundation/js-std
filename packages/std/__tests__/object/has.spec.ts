import { has } from '../../src';

describe('Object > has', () => {
  test('falsy cases', () => {
    expect(has()).toBe(false);

    expect(has(undefined)).toBe(false);

    expect(has(null)).toBe(false);

    expect(has({})).toBe(false);

    expect(has({}, undefined)).toBe(false);

    expect(has({}, '')).toBe(false);

    expect(has({}, [])).toBe(false);

    expect(has({ a: 1 }, 'b')).toBe(false);

    expect(has({ a: { b: [] } }, 'a.b.0')).toBe(false);

    expect(has({ a: { b: [1, 2, 3] } }, 'a.b.3')).toBe(false);

    expect(has({ a: { 'b.c': 1 } }, 'a.b.c')).toBe(false);

    expect(has({ a: { b: null } }, 'a.b.c')).toBe(false);

    expect(has({ a: { b: undefined } }, 'a.b.c')).toBe(false);

    expect(has([1], '1')).toBe(false);

    expect(has([1], [1])).toBe(false);
    expect(has({ a: { b: [1, 2, 3, { c: 5 }] } }, 'a.b[5].c')).toBe(false);
  });

  test('truthy cases', () => {
    expect(has({ a: undefined }, 'a')).toBe(true);

    expect(has({ a: undefined }, ['a'])).toBe(true);

    expect(has({ a: null }, 'a')).toBe(true);

    expect(has({ a: 1 }, 'a')).toBe(true);

    expect(has([1], '0')).toBe(true);

    expect(has([1], [0])).toBe(true);

    expect(has({ a: { b: 1 } }, 'a.b')).toBe(true);

    expect(has({ a: { b: 1 } }, ['a', 'b'])).toBe(true);

    expect(has({ a: { b: [] } }, 'a.b')).toBe(true);

    expect(has({ a: { b: [1, 2, 3] } }, 'a.b.0')).toBe(true);

    expect(has({ a: { b: [1, 2, 3] } }, 'a.b[0]')).toBe(true);

    expect(has({ a: { b: [1, 2, 3] } }, 'a.b.1')).toBe(true);

    expect(has({ a: { b: [1, 2, 3] } }, 'a.b.2')).toBe(true);

    expect(has({ a: { b: [1, 2, 3, { c: 5 }] } }, 'a.b[3].c')).toBe(true);

    expect(has({ a: { b: [1, 2, 3, { c: 5 }] } }, 'a.b.[3].c')).toBe(true);

    expect(has({ a: { b: [1, 2, 3, { c: 5 }] } }, ['a', 'b', '3', 'c'])).toBe(
      true
    );

    expect(has({ a: { 'b.c': 1 } }, ['a', 'b.c'])).toBe(true);

    expect(
      has({ 'C:\valid': { folder: { name: 'test' } } }, [
        'C:\valid',
        'folder',
        'name',
      ])
    ).toBe(true);
  });
});
