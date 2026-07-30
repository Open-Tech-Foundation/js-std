import {
  eachAsync,
  everyAsync,
  filterAsync,
  findAsync,
  flatMapAsync,
  mapAsync,
  reduceAsync,
  someAsync,
} from '../../src';

/**
 * Every operator awaits its callback, so a plain value has always worked at
 * run time — the signatures just would not admit one, and a caller mixing a
 * cheap predicate in among expensive ones had to mark it `async` for no
 * reason. These pin that a synchronous callback is accepted and behaves.
 */
describe('Concurrency > synchronous callbacks', () => {
  test('mapAsync', async () => {
    expect(await mapAsync([1, 2, 3], (n) => n * 2)).toEqual([2, 4, 6]);
  });

  test('filterAsync', async () => {
    expect(await filterAsync([1, 2, 3], (n) => n > 1)).toEqual([2, 3]);
  });

  test('eachAsync', async () => {
    const seen: number[] = [];
    await eachAsync([1, 2, 3], (n) => {
      seen.push(n);
    });

    expect(seen).toEqual([1, 2, 3]);
  });

  test('flatMapAsync', async () => {
    expect(await flatMapAsync([1, 2], (n) => [n, n])).toEqual([1, 1, 2, 2]);
  });

  test('reduceAsync', async () => {
    expect(await reduceAsync([1, 2, 3], (acc, n) => acc + n, 0)).toBe(6);
  });

  test('someAsync', async () => {
    expect(await someAsync([1, 2, 3], (n) => n > 2)).toBe(true);
    expect(await someAsync([1, 2, 3], (n) => n > 3)).toBe(false);
  });

  test('everyAsync', async () => {
    expect(await everyAsync([2, 4], (n) => n % 2 === 0)).toBe(true);
    expect(await everyAsync([2, 3], (n) => n % 2 === 0)).toBe(false);
  });

  test('findAsync', async () => {
    expect(await findAsync([1, 2, 3], (n) => n > 1)).toBe(2);
  });

  test('mixes synchronous and asynchronous callbacks', async () => {
    const res = await mapAsync([1, 2, 3], (n) =>
      n === 2 ? Promise.resolve(n * 10) : n,
    );

    expect(res).toEqual([1, 20, 3]);
  });
});
