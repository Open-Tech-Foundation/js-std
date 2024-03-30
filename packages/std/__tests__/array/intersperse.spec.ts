import { intersperse } from '../../src';

describe('Array > intersperse', () => {
  test('invalid & empty array', () => {
    expect(intersperse()).toEqual([]);
    expect(intersperse([])).toEqual([]);
    expect(intersperse([], '&')).toEqual([]);
  });

  test('array with string separator', () => {
    const arr = [1, 2, 3];
    expect(intersperse(arr, '&')).toEqual([1, '&', 2, '&', 3]);
  });

  test('array of strings with separator', () => {
    const arr = ['Home', 'Menu', 'Sub Menu'];
    expect(intersperse(arr, '>')).toEqual([
      'Home',
      '>',
      'Menu',
      '>',
      'Sub Menu',
    ]);
  });

  test('string as list', () => {
    expect(intersperse('Hello', '-')).toEqual('H-e-l-l-o');
  });

  test('seperator cb fn', () => {
    expect(
      intersperse(['a', 'b', 'c'], (i) => `<span key="sep-${i}"> , </span>`)
    ).toEqual([
      'a',
      '<span key="sep-0"> , </span>',
      'b',
      '<span key="sep-1"> , </span>',
      'c',
    ]);
  });

  test('React like list', () => {
    const items = [
      { type: 'div', text: 'Apple' },
      { type: 'div', text: 'Orange' },
      { type: 'div', text: 'Mango' },
    ];
    expect(intersperse(items, { type: 'br' })).toEqual([
      {
        type: 'div',
        text: 'Apple',
      },
      {
        type: 'br',
      },
      {
        type: 'div',
        text: 'Orange',
      },
      {
        type: 'br',
      },
      {
        type: 'div',
        text: 'Mango',
      },
    ]);
  });
});
