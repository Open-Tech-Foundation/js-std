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
