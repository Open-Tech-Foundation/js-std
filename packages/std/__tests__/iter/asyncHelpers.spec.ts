import { describe, expect, test } from 'bun:test';
import {
  countIterAsync,
  dropIterAsync,
  dropWhileIterAsync,
  eachIterAsync,
  everyIterAsync,
  filterIterAsync,
  findIndexIterAsync,
  findIterAsync,
  findLastIndexIterAsync,
  findLastIterAsync,
  firstIterAsync,
  flatMapIterAsync,
  fromIterAsync,
  isAsyncIterable,
  isIterable,
  lastIterAsync,
  mapIterAsync,
  nthIterAsync,
  reduceIterAsync,
  someIterAsync,
  takeIterAsync,
  takeWhileIterAsync,
  toArrayIterAsync,
  toAsyncIter,
} from '../../src';

async function* asyncGen(arr: any[]) {
  for (const item of arr) {
    yield item;
  }
}

describe('IterAsync Helpers', () => {
  test('toArrayIterAsync', async () => {
    const arr = [1, 2, 3];
    expect(await toArrayIterAsync(asyncGen(arr))).toEqual(arr);
    expect(await toArrayIterAsync(asyncGen([]))).toEqual([]);
  });

  test('mapIterAsync', async () => {
    const doubled = mapIterAsync(asyncGen([1, 2, 3]), (x) => x * 2);
    expect(await toArrayIterAsync(doubled)).toEqual([2, 4, 6]);

    const asyncDoubled = mapIterAsync(asyncGen([1, 2, 3]), async (x) => x * 2);
    expect(await toArrayIterAsync(asyncDoubled)).toEqual([2, 4, 6]);
  });

  test('filterIterAsync', async () => {
    const evens = filterIterAsync(asyncGen([1, 2, 3, 4]), (x) => x % 2 === 0);
    expect(await toArrayIterAsync(evens)).toEqual([2, 4]);

    const asyncEvens = filterIterAsync(
      asyncGen([1, 2, 3, 4]),
      async (x) => x % 2 === 0,
    );
    expect(await toArrayIterAsync(asyncEvens)).toEqual([2, 4]);
  });

  test('flatMapIterAsync', async () => {
    const flattened = flatMapIterAsync(asyncGen([1, 2]), (x) => [x, x * 10]);
    expect(await toArrayIterAsync(flattened)).toEqual([1, 10, 2, 20]);

    const asyncFlattened = flatMapIterAsync(asyncGen([1, 2]), async (x) =>
      asyncGen([x, x * 10]),
    );
    expect(await toArrayIterAsync(asyncFlattened)).toEqual([1, 10, 2, 20]);
  });

  test('reduceIterAsync', async () => {
    const sum = await reduceIterAsync(
      asyncGen([1, 2, 3]),
      (acc, x) => acc + x,
      0,
    );
    expect(sum).toBe(6);

    const asyncSum = await reduceIterAsync(
      asyncGen([1, 2, 3]),
      async (acc, x) => acc + x,
      10,
    );
    expect(asyncSum).toBe(16);
  });

  test('eachIterAsync', async () => {
    const result: number[] = [];
    await eachIterAsync(asyncGen([1, 2]), (x) => {
      result.push(x);
    });
    expect(result).toEqual([1, 2]);

    const asyncResult: number[] = [];
    await eachIterAsync(asyncGen([1, 2]), async (x) => {
      asyncResult.push(x);
    });
    expect(asyncResult).toEqual([1, 2]);
  });

  test('someIterAsync', async () => {
    expect(await someIterAsync(asyncGen([1, 2, 3]), (x) => x > 2)).toBe(true);
    expect(await someIterAsync(asyncGen([1, 2, 3]), (x) => x > 5)).toBe(false);
    expect(await someIterAsync(asyncGen([1, 2, 3]), async (x) => x === 2)).toBe(
      true,
    );
  });

  test('everyIterAsync', async () => {
    expect(await everyIterAsync(asyncGen([1, 2, 3]), (x) => x > 0)).toBe(true);
    expect(await everyIterAsync(asyncGen([1, 2, 3]), (x) => x > 1)).toBe(false);
    expect(await everyIterAsync(asyncGen([1, 2, 3]), async (x) => x < 5)).toBe(
      true,
    );
  });

  test('findIterAsync', async () => {
    expect(await findIterAsync(asyncGen([1, 2, 3]), (x) => x > 1)).toBe(2);
    expect(await findIterAsync(asyncGen([1, 2, 3]), (x) => x > 5)).toBe(
      undefined,
    );
    expect(await findIterAsync(asyncGen([1, 2, 3]), async (x) => x === 3)).toBe(
      3,
    );
  });

  describe('Edge Cases', () => {
    test('empty iterators', async () => {
      expect(await toArrayIterAsync(asyncGen([]))).toEqual([]);
      expect(await reduceIterAsync(asyncGen([]), (acc, x) => acc + x, 0)).toBe(
        0,
      );
      expect(await someIterAsync(asyncGen([]), (x) => true)).toBe(false);
      expect(await everyIterAsync(asyncGen([]), (x) => false)).toBe(true);
      expect(await findIterAsync(asyncGen([]), (x) => true)).toBe(undefined);
    });

    test('errors in async iterators', async () => {
      async function* errorGen() {
        yield 1;
        throw new Error('Async error');
      }

      try {
        await toArrayIterAsync(errorGen());
      } catch (e) {
        expect(e.message).toBe('Async error');
      }
    });

    test('errors in callbacks', async () => {
      try {
        await mapIterAsync(asyncGen([1]), () => {
          throw new Error('Callback error');
        }).next();
      } catch (e) {
        expect(e.message).toBe('Callback error');
      }
    });
  });

  describe('New Iter Utilities', () => {
    test('fromIterAsync', async () => {
      const arr = [1, 2, 3];
      expect(await toArrayIterAsync(fromIterAsync(arr))).toEqual(arr);
      expect(await toArrayIterAsync(fromIterAsync(asyncGen(arr)))).toEqual(arr);
      expect(
        await toArrayIterAsync(
          fromIterAsync({ next: () => ({ value: 1, done: true }) }),
        ),
      ).toEqual([]);
    });

    test('toAsyncIter', async () => {
      const arr = [1, 2, 3];
      expect(await toArrayIterAsync(toAsyncIter(arr))).toEqual(arr);
    });

    test('takeIterAsync', async () => {
      const it = takeIterAsync(asyncGen([1, 2, 3, 4]), 2);
      expect(await toArrayIterAsync(it)).toEqual([1, 2]);
      expect(await toArrayIterAsync(takeIterAsync(asyncGen([1]), 5))).toEqual([
        1,
      ]);
      expect(
        await toArrayIterAsync(takeIterAsync(asyncGen([1, 2]), 0)),
      ).toEqual([]);
      expect(await toArrayIterAsync(takeIterAsync(asyncGen([]), 3))).toEqual(
        [],
      );
    });

    test('dropIterAsync', async () => {
      const it = dropIterAsync(asyncGen([1, 2, 3, 4]), 2);
      expect(await toArrayIterAsync(it)).toEqual([3, 4]);
      expect(await toArrayIterAsync(dropIterAsync(asyncGen([1]), 5))).toEqual(
        [],
      );
      expect(
        await toArrayIterAsync(dropIterAsync(asyncGen([1, 2]), 0)),
      ).toEqual([1, 2]);
      expect(await toArrayIterAsync(dropIterAsync(asyncGen([]), 3))).toEqual(
        [],
      );
    });

    test('takeWhileIterAsync', async () => {
      const it = takeWhileIterAsync(asyncGen([1, 2, 3, 4]), (x) => x < 3);
      expect(await toArrayIterAsync(it)).toEqual([1, 2]);
    });

    test('dropWhileIterAsync', async () => {
      const it = dropWhileIterAsync(asyncGen([1, 2, 3, 4]), (x) => x < 3);
      expect(await toArrayIterAsync(it)).toEqual([3, 4]);
    });

    test('nthIterAsync', async () => {
      expect(await nthIterAsync(asyncGen([1, 2, 3]), 1)).toBe(2);
      expect(await nthIterAsync(asyncGen([1, 2, 3]), 5)).toBe(undefined);
    });

    test('firstIterAsync', async () => {
      expect(await firstIterAsync(asyncGen([1, 2, 3]))).toBe(1);
      expect(await firstIterAsync(asyncGen([]))).toBe(undefined);
    });

    test('lastIterAsync', async () => {
      expect(await lastIterAsync(asyncGen([1, 2, 3]))).toBe(3);
      expect(await lastIterAsync(asyncGen([]))).toBe(undefined);
    });

    test('countIterAsync', async () => {
      expect(await countIterAsync(asyncGen([1, 2, 3]))).toBe(3);
      expect(await countIterAsync(asyncGen([]))).toBe(0);
    });

    test('findLastIterAsync', async () => {
      expect(
        await findLastIterAsync(asyncGen([1, 2, 3, 2]), (x) => x === 2),
      ).toBe(2);
      expect(await findLastIterAsync(asyncGen([1, 2, 3]), (x) => x > 5)).toBe(
        undefined,
      );
    });

    test('findIndexIterAsync', async () => {
      expect(
        await findIndexIterAsync(asyncGen([1, 2, 3]), (x) => x === 2),
      ).toBe(1);
      expect(await findIndexIterAsync(asyncGen([1, 2, 3]), (x) => x > 5)).toBe(
        -1,
      );
    });

    test('findLastIndexIterAsync', async () => {
      expect(
        await findLastIndexIterAsync(asyncGen([1, 2, 3, 2]), (x) => x === 2),
      ).toBe(3);
      expect(
        await findLastIndexIterAsync(asyncGen([1, 2, 3]), (x) => x > 5),
      ).toBe(-1);
    });
  });

  describe('Type Checks', () => {
    test('isIterable', () => {
      expect(isIterable([])).toBe(true);
      expect(isIterable('abc')).toBe(true);
      expect(isIterable({})).toBe(false);
      expect(isIterable(null)).toBe(false);
    });

    test('isAsyncIterable', () => {
      expect(isAsyncIterable(asyncGen([]))).toBe(true);
      expect(isAsyncIterable([])).toBe(false);
    });
  });
});
