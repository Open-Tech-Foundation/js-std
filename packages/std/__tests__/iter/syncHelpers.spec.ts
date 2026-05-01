import {
  mapIter,
  filterIter,
  flatMapIter,
  reduceIter,
  toArrayIter,
  eachIter,
  someIter,
  everyIter,
  findIter,
  findLastIter,
  findIndexIter,
  findLastIndexIter,
  firstIter,
  lastIter,
  nthIter,
  countIter,
  takeWhileIter,
  dropWhileIter,
} from '../../src';

function* syncGen(arr: any[]) {
  for (const item of arr) {
    yield item;
  }
}

describe('Iter Sync Helpers', () => {
  test('toArrayIter', () => {
    expect(toArrayIter(syncGen([1, 2, 3]))).toEqual([1, 2, 3]);
    expect(toArrayIter(syncGen([]))).toEqual([]);
    expect(toArrayIter([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('mapIter', () => {
    const doubled = mapIter(syncGen([1, 2, 3]), (x) => x * 2);
    expect(toArrayIter(doubled)).toEqual([2, 4, 6]);
  });

  test('filterIter', () => {
    const evens = filterIter(syncGen([1, 2, 3, 4]), (x) => x % 2 === 0);
    expect(toArrayIter(evens)).toEqual([2, 4]);
  });

  test('flatMapIter', () => {
    const flattened = flatMapIter(syncGen([1, 2]), (x) => [x, x * 10]);
    expect(toArrayIter(flattened)).toEqual([1, 10, 2, 20]);
  });

  test('reduceIter', () => {
    expect(reduceIter(syncGen([1, 2, 3]), (acc, x) => acc + x, 0)).toBe(6);
    expect(reduceIter(syncGen([1, 2, 3]), (acc, x) => acc + x, 10)).toBe(16);
  });

  test('eachIter', () => {
    const result: number[] = [];
    eachIter(syncGen([1, 2]), (x) => result.push(x));
    expect(result).toEqual([1, 2]);
  });

  test('someIter', () => {
    expect(someIter(syncGen([1, 2, 3]), (x) => x > 2)).toBe(true);
    expect(someIter(syncGen([1, 2, 3]), (x) => x > 5)).toBe(false);
  });

  test('everyIter', () => {
    expect(everyIter(syncGen([1, 2, 3]), (x) => x > 0)).toBe(true);
    expect(everyIter(syncGen([1, 2, 3]), (x) => x > 1)).toBe(false);
  });

  test('findIter', () => {
    expect(findIter(syncGen([1, 2, 3]), (x) => x > 1)).toBe(2);
    expect(findIter(syncGen([1, 2, 3]), (x) => x > 5)).toBe(undefined);
  });

  test('findLastIter', () => {
    expect(findLastIter(syncGen([1, 2, 3, 2]), (x) => x === 2)).toBe(2);
    expect(findLastIter(syncGen([1, 2, 3]), (x) => x > 5)).toBe(undefined);
  });

  test('findIndexIter', () => {
    expect(findIndexIter(syncGen([1, 2, 3]), (x) => x === 2)).toBe(1);
    expect(findIndexIter(syncGen([1, 2, 3]), (x) => x > 5)).toBe(-1);
  });

  test('findLastIndexIter', () => {
    expect(findLastIndexIter(syncGen([1, 2, 3, 2]), (x) => x === 2)).toBe(3);
    expect(findLastIndexIter(syncGen([1, 2, 3]), (x) => x > 5)).toBe(-1);
  });

  test('firstIter', () => {
    expect(firstIter(syncGen([1, 2, 3]))).toBe(1);
    expect(firstIter(syncGen([]))).toBe(undefined);
  });

  test('lastIter', () => {
    expect(lastIter(syncGen([1, 2, 3]))).toBe(3);
    expect(lastIter(syncGen([]))).toBe(undefined);
  });

  test('nthIter', () => {
    expect(nthIter(syncGen([1, 2, 3]), 1)).toBe(2);
    expect(nthIter(syncGen([1, 2, 3]), 5)).toBe(undefined);
    expect(nthIter(syncGen([1, 2, 3]), -1)).toBe(undefined);
  });

  test('countIter', () => {
    expect(countIter(syncGen([1, 2, 3]))).toBe(3);
    expect(countIter(syncGen([]))).toBe(0);
  });

  test('takeWhileIter', () => {
    expect(toArrayIter(takeWhileIter(syncGen([1, 2, 3, 4]), (x) => x < 3))).toEqual([1, 2]);
    expect(toArrayIter(takeWhileIter(syncGen([1, 2, 3]), (x) => x < 0))).toEqual([]);
    expect(toArrayIter(takeWhileIter(syncGen([1, 2, 3]), (x) => x < 5))).toEqual([1, 2, 3]);
  });

  test('dropWhileIter', () => {
    expect(toArrayIter(dropWhileIter(syncGen([1, 2, 3, 4]), (x) => x < 3))).toEqual([3, 4]);
    expect(toArrayIter(dropWhileIter(syncGen([1, 2, 3]), (x) => x > 5))).toEqual([1, 2, 3]);
    expect(toArrayIter(dropWhileIter(syncGen([1, 2, 3]), (x) => x < 5))).toEqual([]);
  });

  test('empty iterators', () => {
    expect(toArrayIter(syncGen([]))).toEqual([]);
    expect(reduceIter(syncGen([]), (acc, x) => acc + x, 0)).toBe(0);
    expect(someIter(syncGen([]), (x) => true)).toBe(false);
    expect(everyIter(syncGen([]), (x) => false)).toBe(true);
    expect(findIter(syncGen([]), (x) => true)).toBe(undefined);
    expect(firstIter(syncGen([]))).toBe(undefined);
    expect(lastIter(syncGen([]))).toBe(undefined);
    expect(countIter(syncGen([]))).toBe(0);
  });
});
