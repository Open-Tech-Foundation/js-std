import {
  chunkIterAsync,
  concatIterAsync,
  takeIterAsync,
  toArrayIterAsync,
  uniqueIterAsync,
  zipIterAsync,
} from '../../src';

async function* asyncGen<T>(arr: T[]) {
  for (const item of arr) {
    yield item;
  }
}

/** Counts how many items a consumer actually pulled. */
async function* counting<T>(arr: T[], seen: T[]) {
  for (const item of arr) {
    seen.push(item);
    yield item;
  }
}

async function* naturals() {
  let n = 0;
  while (true) {
    yield n++;
  }
}

describe('Iter > chunkIterAsync', () => {
  test('groups items by size', async () => {
    expect(
      await toArrayIterAsync(chunkIterAsync(asyncGen([1, 2, 3, 4]), 2)),
    ).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  test('yields a short trailing group', async () => {
    expect(
      await toArrayIterAsync(chunkIterAsync(asyncGen([1, 2, 3]), 2)),
    ).toEqual([[1, 2], [3]]);
  });

  test('yields nothing for an empty source', async () => {
    expect(await toArrayIterAsync(chunkIterAsync(asyncGen([]), 2))).toEqual([]);
  });

  test('works on an endless source', async () => {
    expect(
      await toArrayIterAsync(takeIterAsync(chunkIterAsync(naturals(), 3), 2)),
    ).toEqual([
      [0, 1, 2],
      [3, 4, 5],
    ]);
  });

  test('rejects a bad size at the call, not on the first pull', () => {
    expect(() => chunkIterAsync(asyncGen([1]), 0)).toThrow(
      'Size must be an integer greater than zero.',
    );
  });
});

describe('Iter > zipIterAsync', () => {
  test('groups items by position', async () => {
    expect(
      await toArrayIterAsync(
        zipIterAsync(asyncGen([1, 2]), asyncGen(['a', 'b'])),
      ),
    ).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  test('pads exhausted sources with undefined, like zip', async () => {
    expect(
      await toArrayIterAsync(
        zipIterAsync(asyncGen([1, 2, 3]), asyncGen(['a'])),
      ),
    ).toEqual([
      [1, 'a'],
      [2, undefined],
      [3, undefined],
    ]);
  });

  test('yields nothing for no sources', async () => {
    expect(await toArrayIterAsync(zipIterAsync())).toEqual([]);
  });

  test('yields nothing when every source is empty', async () => {
    expect(
      await toArrayIterAsync(zipIterAsync(asyncGen([]), asyncGen([]))),
    ).toEqual([]);
  });

  test('does not advance a source that is already done', async () => {
    const seen: number[] = [];
    await toArrayIterAsync(
      zipIterAsync(counting([1], seen), asyncGen(['a', 'b', 'c'])),
    );

    expect(seen).toEqual([1]);
  });

  test('advances the sources together, not one after another', async () => {
    // Both sides are pulled before the row is yielded, so the order records
    // the two starts before either completes a second time.
    const order: string[] = [];
    async function* tagged(tag: string, n: number) {
      for (let i = 0; i < n; i++) {
        order.push(tag);
        yield i;
      }
    }

    await toArrayIterAsync(
      takeIterAsync(zipIterAsync(tagged('a', 3), tagged('b', 3)), 2),
    );

    expect(order).toEqual(['a', 'b', 'a', 'b']);
  });

  test('closes the sources when the consumer stops early', async () => {
    let closed = false;
    async function* closable() {
      try {
        yield 1;
        yield 2;
      } finally {
        closed = true;
      }
    }

    for await (const _row of zipIterAsync(closable(), asyncGen(['a', 'b']))) {
      break;
    }

    expect(closed).toBe(true);
  });
});

describe('Iter > uniqueIterAsync', () => {
  test('drops repeats, keeping first-seen order', async () => {
    expect(
      await toArrayIterAsync(uniqueIterAsync(asyncGen([1, 2, 2, 3, 1]))),
    ).toEqual([1, 2, 3]);
  });

  test('yields nothing for an empty source', async () => {
    expect(await toArrayIterAsync(uniqueIterAsync(asyncGen([])))).toEqual([]);
  });

  test('compares objects structurally, like unique', async () => {
    expect(
      await toArrayIterAsync(
        uniqueIterAsync(asyncGen([{ a: 1 }, { a: 1 }, { a: 2 }])),
      ),
    ).toEqual([{ a: 1 }, { a: 2 }]);
  });

  test('awaits an async iteratee', async () => {
    const users = [{ id: 1 }, { id: 2 }, { id: 1 }];
    expect(
      await toArrayIterAsync(
        uniqueIterAsync(asyncGen(users), async (u) => u.id),
      ),
    ).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('emits before the source ends', async () => {
    const seen: number[] = [];
    expect(
      await toArrayIterAsync(
        takeIterAsync(uniqueIterAsync(counting([1, 1, 2, 3], seen)), 2),
      ),
    ).toEqual([1, 2]);
    expect(seen).toEqual([1, 1, 2]);
  });
});

describe('Iter > concatIterAsync', () => {
  test('yields each source in turn', async () => {
    expect(
      await toArrayIterAsync(
        concatIterAsync(asyncGen([1, 2]), asyncGen([3, 4])),
      ),
    ).toEqual([1, 2, 3, 4]);
  });

  test('yields nothing for no sources', async () => {
    expect(await toArrayIterAsync(concatIterAsync())).toEqual([]);
  });

  test('skips empty sources', async () => {
    expect(
      await toArrayIterAsync(
        concatIterAsync(asyncGen([]), asyncGen([1]), asyncGen([])),
      ),
    ).toEqual([1]);
  });

  test('never touches a later source when the consumer stops early', async () => {
    const seen: number[] = [];
    await toArrayIterAsync(
      takeIterAsync(
        concatIterAsync(asyncGen([1, 2]), counting([3, 4], seen)),
        1,
      ),
    );

    expect(seen).toEqual([]);
  });
});
