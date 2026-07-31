import { unflattenObject } from '../../src';

describe('Object > unflattenObject', () => {
  test('expands dotted keys', () => {
    expect(unflattenObject({ 'a.b.c': 1 })).toEqual({ a: { b: { c: 1 } } });
  });

  test('expands bracketed indices into arrays', () => {
    expect(unflattenObject({ 'a[0]': 1, 'a[1]': 2 })).toEqual({ a: [1, 2] });
  });

  test('accepts dotted indices as well as bracketed ones', () => {
    expect(unflattenObject({ 'a.0': 1, 'a.1': 2 })).toEqual({ a: [1, 2] });
  });

  test('merges keys sharing a branch', () => {
    expect(
      unflattenObject({ 'user.name': 'Tom', 'user.age': 30, id: 1 }),
    ).toEqual({ user: { name: 'Tom', age: 30 }, id: 1 });
  });

  test('mixes objects and arrays along one path', () => {
    expect(
      unflattenObject({ 'users[0].name': 'Tom', 'users[1].name': 'Ram' }),
    ).toEqual({ users: [{ name: 'Tom' }, { name: 'Ram' }] });
  });

  test('leaves an already flat object alone', () => {
    expect(unflattenObject({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  test('gives an array root when every key is an index', () => {
    expect(unflattenObject({ '[0]': 'a', '[1]': 'b' })).toEqual(['a', 'b']);
    expect(Array.isArray(unflattenObject({ '[0]': 'a' }))).toBe(true);
  });

  test('gives an object root when the keys are mixed', () => {
    const res = unflattenObject({ '[0]': 'a', b: 1 });

    expect(Array.isArray(res)).toBe(false);
    expect(res).toEqual({ 0: 'a', b: 1 });
  });

  test('gives an object for an empty input', () => {
    expect(unflattenObject({})).toEqual({});
    expect(unflattenObject()).toEqual({});
  });

  test('keeps values as they are, expanding only the keys', () => {
    const date = new Date(0);
    const nested = { already: 'nested' };

    expect(unflattenObject({ 'a.date': date, 'a.obj': nested })).toEqual({
      a: { date, obj: nested },
    });
  });

  test('refuses prototype-polluting keys', () => {
    const res = unflattenObject({ '__proto__.polluted': true }) as any;

    expect(res.polluted).toBeUndefined();
    expect(({} as any).polluted).toBeUndefined();
    expect(Object.prototype).not.toHaveProperty('polluted');
  });

  test('refuses constructor and prototype keys too', () => {
    unflattenObject({ 'constructor.prototype.polluted': true });

    expect(({} as any).polluted).toBeUndefined();
  });

  test('ignores a non-object input', () => {
    expect(unflattenObject(null as unknown as Record<string, unknown>)).toEqual(
      {},
    );
    expect(
      unflattenObject([1, 2] as unknown as Record<string, unknown>),
    ).toEqual({});
  });

  test('gives the later key the leaf when two disagree', () => {
    expect(unflattenObject({ 'a.b': 1, a: 2 })).toEqual({ a: 2 });
  });
});
