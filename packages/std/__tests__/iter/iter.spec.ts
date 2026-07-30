import { dropIter, dropIterAsync, takeIter, takeIterAsync } from '../../src';

describe('Iter Utilities', () => {
  function* gen() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
  }

  async function* asyncGen() {
    yield 1;
    yield 2;
    yield 3;
  }

  test('takeIter', () => {
    const result = Array.from(takeIter(gen(), 3));
    expect(result).toEqual([1, 2, 3]);
  });

  test('takeIter reads exactly n items and no more', () => {
    const seen: number[] = [];
    function* counting() {
      for (const n of [1, 2, 3, 4]) {
        seen.push(n);
        yield n;
      }
    }

    expect(Array.from(takeIter(counting(), 2))).toEqual([1, 2]);
    expect(seen).toEqual([1, 2]);
  });

  test('takeIter reads nothing at all for n <= 0', () => {
    const seen: number[] = [];
    function* counting() {
      for (const n of [1, 2, 3]) {
        seen.push(n);
        yield n;
      }
    }

    expect(Array.from(takeIter(counting(), 0))).toEqual([]);
    expect(seen).toEqual([]);
    expect(Array.from(takeIter(counting(), -1))).toEqual([]);
    expect(seen).toEqual([]);
  });

  test('takeIter stops short when the source is shorter than n', () => {
    expect(Array.from(takeIter(gen(), 99))).toEqual([1, 2, 3, 4, 5]);
  });

  test('takeIterAsync reads exactly n items and no more', async () => {
    const seen: number[] = [];
    async function* counting() {
      for (const n of [1, 2, 3, 4]) {
        seen.push(n);
        yield n;
      }
    }

    const result = [];
    for await (const item of takeIterAsync(counting(), 2)) {
      result.push(item);
    }

    expect(result).toEqual([1, 2]);
    expect(seen).toEqual([1, 2]);
  });

  test('takeIterAsync reads nothing at all for n <= 0', async () => {
    const seen: number[] = [];
    async function* counting() {
      for (const n of [1, 2, 3]) {
        seen.push(n);
        yield n;
      }
    }

    const result = [];
    for await (const item of takeIterAsync(counting(), 0)) {
      result.push(item);
    }

    expect(result).toEqual([]);
    expect(seen).toEqual([]);
  });

  test('dropIter', () => {
    const result = Array.from(dropIter(gen(), 3));
    expect(result).toEqual([4, 5]);
  });

  test('takeIterAsync', async () => {
    const result = [];
    for await (const item of takeIterAsync(asyncGen(), 2)) {
      result.push(item);
    }
    expect(result).toEqual([1, 2]);
  });

  test('dropIterAsync', async () => {
    const result = [];
    for await (const item of dropIterAsync(asyncGen(), 1)) {
      result.push(item);
    }
    expect(result).toEqual([2, 3]);
  });
});
