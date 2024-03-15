import { shallowMerge } from '../../src';

describe('Object => shallowMerge', () => {
  test('merge two objs', () => {
    const a = { a: 1 };
    const b = { b: 2 };
    expect(shallowMerge(a, b)).toEqual({ a: 1, b: 2 });
  });

  test('merge two objs override', () => {
    const a = { a: 1 };
    const b = { a: 2 };
    expect(shallowMerge(a, b)).toEqual({ a: 2 });
  });

  test('merge two objs falsy overrides', () => {
    const a = { a: 1 };
    const b = { a: null };

    expect(shallowMerge(a, b)).toEqual({ a: null });
  });

  test('null target & source', () => {
    const a = null;
    const b = { b: 2 };
    expect(shallowMerge(a, b)).toEqual({ b: 2 });
    expect(shallowMerge(b, null)).toEqual({ b: 2 });
    expect(shallowMerge(null, null)).toEqual({});
  });

  test('no prototypes', () => {
    const a = {
      a: 1,
      __proto__: {
        c: 3,
      },
    };
    const b = {
      b: 2,
    };
    expect(shallowMerge(a, b)).toEqual({ a: 1, b: 2 });
  });

  test('duplicate prop', () => {
    const a = { foo: 'bar', qux: 'corge' };
    const b = { foo: 'baz' };
    expect(shallowMerge(a, b)).toEqual({ foo: 'baz', qux: 'corge' });
  });

  test('without source', () => {
    const a = { foo: 'bar', qux: 'corge' };
    expect(shallowMerge(a)).toEqual({ foo: 'bar', qux: 'corge' });
  });

  test('arrays', () => {
    const a = [1];
    const b = [2];
    const c = [3];
    expect(shallowMerge(a)).toEqual([1]);
    expect(shallowMerge(a, b)).toEqual([2]);
    expect(a).toEqual([1]);
    expect(shallowMerge(a, b, c)).toEqual([3]);
    expect(a).toEqual([1]);
    expect(b).toEqual([2]);
  });

  test('arrays in obj', () => {
    const a = { a: [1, 2] };
    const b = { b: [3, 4] };
    const c = { a: [5, 6], c: 'test' };
    expect(shallowMerge(a, a)).toEqual({ a: [1, 2] });
    expect(shallowMerge(a, b)).toEqual({ a: [1, 2], b: [3, 4] });
    expect(shallowMerge(a, b, c)).toEqual({ a: [5, 6], b: [3, 4], c: 'test' });
  });

  test('objs in arrays', () => {
    const a = [{ a: 1 }, 2];
    const b = [{ b: [3, 4] }];
    const out = shallowMerge(a, b);
    expect(out).toEqual([{ b: [3, 4] }, 2]);
    expect(out[0]).toBe(b[0]);
    expect(a).toEqual([{ a: 1 }, 2]);
  });

  test('mix obj & arr', () => {
    const a = [];
    const b = { foo: 'bar' };
    expect(shallowMerge(a, b)).toEqual({ foo: 'bar' });
    expect(shallowMerge(b, a)).toEqual({ foo: 'bar' });
  });

  test('undefined value', () => {
    const a = { foo: 'a' };
    const b = { foo: 'b' };
    const c = { foo: undefined };
    expect(shallowMerge(a, c)).toEqual({ foo: undefined });
    expect(shallowMerge(a, b, c)).toEqual({ foo: undefined });
  });
});
