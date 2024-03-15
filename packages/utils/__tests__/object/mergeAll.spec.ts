import { mergeAll } from '../../src';

describe('Object => mergeAll', () => {
  test('mergeAll two objs', () => {
    const a = { a: 1 };
    const b = { b: 2 };
    expect(mergeAll(a, b)).toEqual({ a: 1, b: 2 });
  });

  test('mergeAll two objs override', () => {
    const a = { a: 1 };
    const b = { a: 2 };
    expect(mergeAll(a, b)).toEqual({ a: 2 });
  });

  test('mergeAll two arrays', () => {
    const a = [1, 2];
    const b = [3, 4];
    expect(mergeAll(a, b)).toEqual([1, 2, 3, 4]);
  });

  test('mergeAll two arrays with invalid values', () => {
    const a = [1, 2];
    const b = [3, 4];
    expect(mergeAll(a, null, b)).toEqual([1, 2, 3, 4]);
    expect(mergeAll(a, null, b, undefined)).toEqual([1, 2, 3, 4]);
    expect(mergeAll(1, a, null, b, undefined)).toEqual([1, 2, 3, 4]);
  });

  test('mergeAll two objs with arrays', () => {
    const a = { a: [1, 2] };
    const b = { b: [3, 4] };
    expect(mergeAll(a, b)).toEqual({ a: [1, 2], b: [3, 4] });
    const object = { a: [1], b: [2] };
    const other = { a: [3], b: [4] };
    expect(mergeAll(object, other)).toEqual({ a: [1, 3], b: [2, 4] });
  });

  test('mergeAll two objs with override', () => {
    const a = { a: [1, 2] };
    const b = { a: [3, 4] };
    expect(mergeAll(a, b)).toEqual({ a: [1, 2, 3, 4] });
  });

  test('mergeAll two objs with sub objects', () => {
    const a = { a: { b: 1 } };
    const b = { b: { c: 2 } };
    expect(mergeAll(a, b)).toEqual({ a: { b: 1 }, b: { c: 2 } });
  });

  test('mergeAll two objs deep level 1', () => {
    const a = { a: { b: 1 } };
    const b = { a: { c: 2 } };
    expect(mergeAll(a, b)).toEqual({ a: { b: 1, c: 2 } });
  });

  test('mergeAll multiple objs deep level 1', () => {
    const a = { a: { b: 1 }, e: 2 };
    const b = { a: { c: 2 } };
    const c = { a: { d: 3 }, e: 5 };
    expect(mergeAll(a, b, c)).toEqual({ a: { b: 1, c: 2, d: 3 }, e: 5 });
  });

  test('mergeAll two objs deep level 2', () => {
    const a = { a: { b: { c: 1 } } };
    const b = { a: { b: { c: 2 } } };
    expect(mergeAll(a, b)).toEqual({ a: { b: { c: 2 } } });
  });

  test('deep nested level', () => {
    const a = {
      code: 'abcdef',
      setupCode: '',
      deps: ['ramda'],
      editor: {
        header: false,
        style: { minHeight: '150px', maxHeight: '300px' },
      },
      terminal: {
        show: false,
      },
      console: { style: { minHeight: '150px', maxHeight: '300px' } },
    };
    const b = {
      deps: ['lodash'],
      console: { show: true, style: { display: 'block' } },
    };
    expect(mergeAll(a, b)).toEqual({
      code: 'abcdef',
      setupCode: '',
      deps: ['ramda', 'lodash'],
      editor: {
        header: false,
        style: { minHeight: '150px', maxHeight: '300px' },
      },
      terminal: {
        show: false,
      },
      console: {
        show: true,
        style: { display: 'block', minHeight: '150px', maxHeight: '300px' },
      },
    });
  });

  test('mergeAll two arrays deep', () => {
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
    const result = mergeAll(a, b);
    expect(result).toEqual([
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
      { name: 'z', age: 10 },
      {
        name: 'y',
        age: 50,
        address: {
          line2: 'area 1',
        },
      },
    ]);
  });
});
