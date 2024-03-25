import { shallowMergeAll } from '../../src';

describe('Object => shallowMergeAll', () => {
  test('merge two objs', () => {
    const a = { a: 1 };
    const b = { b: 2 };
    expect(shallowMergeAll(a, b)).toEqual({ a: 1, b: 2 });
  });

  test('merge two objs override', () => {
    const a = { a: 1 };
    const b = { a: 2 };
    expect(shallowMergeAll(a, b)).toEqual({ a: 2 });
  });

  test('merge two objs falsy overrides', () => {
    const a = { a: 1 };
    const b = { a: null };

    expect(shallowMergeAll(a, b)).toEqual({ a: null });
  });

  test('null target & source', () => {
    const a = null;
    const b = { b: 2 };
    expect(shallowMergeAll(a, b)).toEqual({ b: 2 });
    expect(shallowMergeAll(b, null)).toEqual({ b: 2 });
    expect(shallowMergeAll(null, null)).toEqual({});
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
    expect(shallowMergeAll(a, b)).toEqual({ a: 1, b: 2 });
  });

  test('duplicate prop', () => {
    const a = { foo: 'bar', qux: 'corge' };
    const b = { foo: 'baz' };
    expect(shallowMergeAll(a, b)).toEqual({ foo: 'baz', qux: 'corge' });
  });

  test('without source', () => {
    const a = { foo: 'bar', qux: 'corge' };
    expect(shallowMergeAll(a)).toEqual({ foo: 'bar', qux: 'corge' });
  });

  test('arrays', () => {
    const a = [1];
    const b = [2];
    const c = [3];
    expect(shallowMergeAll(a)).toEqual([1]);
    expect(shallowMergeAll(a, b)).toEqual([1, 2]);
    expect(a).toEqual([1]);
    expect(shallowMergeAll(a, b, c)).toEqual([1, 2, 3]);
    expect(a).toEqual([1]);
    expect(b).toEqual([2]);
  });

  test('arrays in obj', () => {
    const a = { a: [1, 2] };
    const b = { b: [3, 4] };
    const c = { a: [5, 6], c: 'test' };
    expect(shallowMergeAll(a, a)).toEqual({ a: [1, 2] });
    expect(shallowMergeAll(a, b)).toEqual({ a: [1, 2], b: [3, 4] });
    expect(shallowMergeAll(a, b, c)).toEqual({
      a: [5, 6],
      b: [3, 4],
      c: 'test',
    });
  });

  test('objs in arrays', () => {
    const a = [{ a: 1 }, 2];
    const b = [{ b: [3, 4] }];
    const out = shallowMergeAll(a, b);
    expect(out).toEqual([{ a: 1 }, 2, { b: [3, 4] }]);
  });

  test('mix obj & arr', () => {
    const a = [];
    const b = { foo: 'bar' };
    expect(shallowMergeAll(a, b)).toEqual({ foo: 'bar' });
    expect(shallowMergeAll(b, a)).toEqual({ foo: 'bar' });
  });

  test('undefined value', () => {
    const a = { foo: 'a' };
    const b = { foo: 'b' };
    const c = { foo: undefined };
    expect(shallowMergeAll(a, c)).toEqual({ foo: undefined });
    expect(shallowMergeAll(a, b, c)).toEqual({ foo: undefined });
  });
});
