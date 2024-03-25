import { union } from '../../src';

describe('Array > union', () => {
  test('two arrays', () => {
    const setA = [1, 2, 3];
    const setB = [2, 3];
    expect(union([setA, setB])).toEqual([1, 2, 3]);

    const evens = [2, 4, 6, 8];
    const squares = [1, 4, 9];
    expect(union([evens, squares])).toEqual([2, 4, 6, 8, 1, 9]);
  });

  test('multiple arrays', () => {
    const setA = [1, 2, 3];
    const setB = [2, 3];
    const setC = [2, 3, 4, 5];
    expect(union([setA, setB, setC])).toEqual([1, 2, 3, 4, 5]);
  });

  test('two arrays with by fn', () => {
    expect(union([[2.1], [1.2, 2.3]], Math.floor)).toEqual([2.1, 1.2]);
  });

  test('two array of objects', () => {
    const objects = [
      { x: 1, y: 2 },
      { x: 2, y: 1 },
    ];
    const others = [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ];
    expect(union([objects, others])).toEqual([
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
    ]);
  });
});
