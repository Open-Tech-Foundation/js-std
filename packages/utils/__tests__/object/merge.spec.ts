import { merge } from '../../src';

describe('Object => merge', () => {
  test('merge two objs', () => {
    const a = { a: 1 };
    const b = { b: 2 };
    expect(merge(a, b)).toEqual({ a: 1, b: 2 });
  });

  test('merge two objs override', () => {
    const a = { a: 1 };
    const b = { a: 2 };
    expect(merge(a, b)).toEqual({ a: 2 });
  });

  test('merge two arrays', () => {
    const a = [1, 2];
    const b = [3, 4];
    expect(merge(a, b)).toEqual([3, 4]);
  });

  test('merge two arrays with invalid values', () => {
    const a = [1, 2];
    const b = [3, 4];
    expect(merge(a, null, b)).toEqual([3, 4]);
    expect(merge(a, null, b, undefined)).toEqual([3, 4]);
    expect(merge(1, a, null, b, undefined)).toEqual([3, 4]);
  });

  test('merge two objs with arrays', () => {
    const a = { a: [1, 2] };
    const b = { b: [3, 4] };
    expect(merge(a, b)).toEqual({ a: [1, 2], b: [3, 4] });
  });

  test('merge two objs with override', () => {
    const a = { a: [1, 2] };
    const b = { a: [3, 4] };
    expect(merge(a, b)).toEqual({ a: [3, 4] });
  });

  test('merge two objs with sub objects', () => {
    const a = { a: { b: 1 } };
    const b = { b: { c: 2 } };
    expect(merge(a, b)).toEqual({ a: { b: 1 }, b: { c: 2 } });
  });

  test('merge two objs deep level 1', () => {
    const a = { a: { b: 1 } };
    const b = { a: { c: 2 } };
    expect(merge(a, b)).toEqual({ a: { b: 1, c: 2 } });
  });

  test('merge multiple objs deep level 1', () => {
    const a = { a: { b: 1 }, e: 2 };
    const b = { a: { c: 2 } };
    const c = { a: { d: 3 }, e: 5 };
    expect(merge(a, b, c)).toEqual({ a: { b: 1, c: 2, d: 3 }, e: 5 });
  });

  test('merge two objs deep level 2', () => {
    const a = { a: { b: { c: 1 } } };
    const b = { a: { b: { c: 2 } } };
    expect(merge(a, b)).toEqual({ a: { b: { c: 2 } } });
  });

  test('deep nested level', () => {
    const a = {
      code: 'abcdef',
      setupCode: '',
      deps: [],
      editor: {
        header: false,
        style: { minHeight: '150px', maxHeight: '300px' },
      },
      terminal: {
        show: false,
      },
      console: { style: { minHeight: '150px', maxHeight: '300px' } },
    };
    const b = { deps: ['lodash'], console: { show: true } };
    expect(merge(a, b)).toEqual({
      code: 'abcdef',
      setupCode: '',
      deps: ['lodash'],
      editor: {
        header: false,
        style: { minHeight: '150px', maxHeight: '300px' },
      },
      terminal: {
        show: false,
      },
      console: {
        show: true,
        style: { minHeight: '150px', maxHeight: '300px' },
      },
    });
  });

  test('merge two arrays deep', () => {
    const a = [
      {
        name: 'x',
        age: 23,
      },
      {
        name: 'y',
        age: 45,
        address: {
          line1: 'street1',
        },
      },
    ];

    const b = [
      {
        name: 'z',
        age: 10,
      },
      {
        name: 'y',
        age: 50,
        address: {
          line2: 'area 1',
        },
      },
    ];
    const result = merge(a, b);
    expect(result).toEqual([
      { name: 'z', age: 10 },
      {
        name: 'y',
        age: 50,
        address: {
          line1: 'street1',
          line2: 'area 1',
        },
      },
    ]);
  });
});
