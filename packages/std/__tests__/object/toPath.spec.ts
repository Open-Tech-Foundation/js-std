import { toPath } from '../../src';

describe('Object > toPath', () => {
  test('invalid', () => {
    expect(toPath()).toEqual([]);
    expect(toPath('')).toEqual([]);
    expect(toPath('.')).toEqual([]);
    expect(toPath('.a.')).toEqual(['a']);
    expect(toPath('a[0')).toEqual(['a', '0']);
  });

  test('single prop', () => {
    expect(toPath('a')).toEqual(['a']);
    expect(toPath(' ')).toEqual([' ']);
    expect(toPath([])).toEqual([]);
    expect(toPath([0])).toEqual([0]);
    expect(toPath([null])).toEqual([null]);
  });

  test('two props', () => {
    expect(toPath('a.b')).toEqual(['a', 'b']);
    expect(toPath('0.1')).toEqual(['0', '1']);
  });

  test('multi props', () => {
    expect(toPath('a.b.c')).toEqual(['a', 'b', 'c']);
    expect(toPath('a.0.c')).toEqual(['a', '0', 'c']);
  });

  test('square brackets', () => {
    expect(toPath('a[0]')).toEqual(['a', '0']);
    expect(toPath('a.b[1]')).toEqual(['a', 'b', '1']);
    expect(toPath('a.b[0].c')).toEqual(['a', 'b', '0', 'c']);
  });

  test('array of props', () => {
    const arr = ['a', 'b', 'c'];
    expect(toPath(arr)).toEqual(['a', 'b', 'c']);
    expect(toPath(arr)).not.toBe(arr);
  });

  test('symbols', () => {
    const sym = Symbol('a');
    expect(toPath(sym)).toEqual([sym]);
  });

  test('snake-case keys', () => {
    expect(toPath('user-details')).toEqual(['user-details']);
    expect(toPath('a-b[0]')).toEqual(['a-b', '0']);
  });

  test('floating point keys', () => {
    expect(toPath('a[10.45]')).toEqual(['a', '10.45']);
    expect(toPath('a.b.c[-1.0]')).toEqual(['a', 'b', 'c', '-1.0']);
  });

  test('char symbols', () => {
    expect(toPath('_private.user.details')).toEqual([
      '_private',
      'user',
      'details',
    ]);
  });

  test('quotes', () => {
    expect(toPath(`x's prop`)).toEqual([`x's prop`]);
    expect(toPath(`"x".prop.next[0].name`)).toEqual([
      `"x"`,
      'prop',
      'next',
      '0',
      'name',
    ]);
  });
});
