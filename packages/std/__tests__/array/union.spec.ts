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

describe('Array > union flattening', () => {
  test('is linear in the total number of elements', () => {
    // Flattening with `reduce` + `concat` copied the accumulator every step,
    // so 100,000 elements took 3.6 seconds.
    const collections = Array.from({ length: 100_000 }, (_, i) => [i]);

    const start = performance.now();
    const out = union(collections);
    const elapsed = performance.now() - start;

    expect(out).toHaveLength(100_000);
    expect(elapsed).toBeLessThan(2000);
  });

  test('keeps the flattening semantics concat had', () => {
    expect(union([[1, 2], [2, 3]])).toEqual([1, 2, 3]);
    expect(union([])).toEqual([]);
    expect(union([[1], [2], [3]])).toEqual([1, 2, 3]);
    // A non-array member was appended as a single value.
    expect(union([[1], 2 as unknown as unknown[]])).toEqual([1, 2]);
  });
});
