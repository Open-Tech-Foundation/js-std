import {
  chunkIter,
  concatIter,
  takeIter,
  toArrayIter,
  uniqueIter,
  zipIter,
} from '../../src';

function* syncGen<T>(arr: T[]) {
  for (const item of arr) {
    yield item;
  }
}

/** Counts how many items a consumer actually pulled. */
function* counting<T>(arr: T[], seen: T[]) {
  for (const item of arr) {
    seen.push(item);
    yield item;
  }
}

function* naturals() {
  let n = 0;
  while (true) {
    yield n++;
  }
}

describe('Iter > chunkIter', () => {
  test('groups items by size', () => {
    expect(toArrayIter(chunkIter(syncGen([1, 2, 3, 4]), 2))).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  test('yields a short trailing group', () => {
    expect(toArrayIter(chunkIter(syncGen([1, 2, 3, 4, 5]), 2))).toEqual([
      [1, 2],
      [3, 4],
      [5],
    ]);
  });

  test('defaults to a size of one', () => {
    expect(toArrayIter(chunkIter(syncGen([1, 2])))).toEqual([[1], [2]]);
  });

  test('yields nothing for an empty source', () => {
    expect(toArrayIter(chunkIter(syncGen([]), 2))).toEqual([]);
  });

  test('works on an infinite source', () => {
    expect(toArrayIter(takeIter(chunkIter(naturals(), 3), 2))).toEqual([
      [0, 1, 2],
      [3, 4, 5],
    ]);
  });

  test('reads only as far as the groups taken', () => {
    const seen: number[] = [];
    toArrayIter(takeIter(chunkIter(counting([1, 2, 3, 4, 5, 6], seen), 2), 1));

    expect(seen).toEqual([1, 2]);
  });

  test('rejects a bad size at the call, not on the first pull', () => {
    // A generator body does not run until the first `next()`, so a lazy
    // check would let the bad argument escape the frame that produced it.
    expect(() => chunkIter(syncGen([1]), 0)).toThrow(
      'Size must be an integer greater than zero.',
    );
    expect(() => chunkIter(syncGen([1]), 1.5)).toThrow(
      'Size must be an integer greater than zero.',
    );
    expect(() => chunkIter(syncGen([1]), -1)).toThrow(
      'Size must be an integer greater than zero.',
    );
  });
});

describe('Iter > zipIter', () => {
  test('groups items by position', () => {
    expect(toArrayIter(zipIter(syncGen([1, 2]), syncGen(['a', 'b'])))).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  test('pads exhausted sources with undefined, like zip', () => {
    expect(toArrayIter(zipIter(syncGen([1, 2, 3]), syncGen(['a'])))).toEqual([
      [1, 'a'],
      [2, undefined],
      [3, undefined],
    ]);
  });

  test('zips more than two sources', () => {
    expect(
      toArrayIter(zipIter(syncGen([1]), syncGen([2]), syncGen([3]))),
    ).toEqual([[1, 2, 3]]);
  });

  test('yields nothing for no sources', () => {
    expect(toArrayIter(zipIter())).toEqual([]);
  });

  test('yields nothing when every source is empty', () => {
    expect(toArrayIter(zipIter(syncGen([]), syncGen([])))).toEqual([]);
  });

  test('does not advance a source that is already done', () => {
    const seen: number[] = [];
    toArrayIter(zipIter(counting([1], seen), syncGen(['a', 'b', 'c'])));

    // One value plus the pull that reported done — never more.
    expect(seen).toEqual([1]);
  });

  test('pairs an infinite source with a finite one', () => {
    expect(toArrayIter(takeIter(zipIter(naturals(), naturals()), 3))).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
  });

  test('closes the sources when the consumer stops early', () => {
    let closed = false;
    function* closable() {
      try {
        yield 1;
        yield 2;
      } finally {
        closed = true;
      }
    }

    for (const _row of zipIter(closable(), syncGen(['a', 'b']))) {
      break;
    }

    expect(closed).toBe(true);
  });
});

describe('Iter > uniqueIter', () => {
  test('drops repeats, keeping first-seen order', () => {
    expect(toArrayIter(uniqueIter(syncGen([1, 2, 2, 3, 1])))).toEqual([
      1, 2, 3,
    ]);
  });

  test('yields nothing for an empty source', () => {
    expect(toArrayIter(uniqueIter(syncGen([])))).toEqual([]);
  });

  test('compares objects structurally, like unique', () => {
    expect(
      toArrayIter(uniqueIter(syncGen([{ a: 1 }, { a: 1 }, { a: 2 }]))),
    ).toEqual([{ a: 1 }, { a: 2 }]);
  });

  test('derives the key with the iteratee', () => {
    const users = [{ id: 1 }, { id: 2 }, { id: 1 }];
    expect(toArrayIter(uniqueIter(syncGen(users), (u) => u.id))).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  test('matches primitives by identity', () => {
    expect(toArrayIter(uniqueIter(syncGen([Number.NaN, Number.NaN])))).toEqual([
      Number.NaN,
    ]);
    expect(toArrayIter(uniqueIter(syncGen([0, -0])))).toEqual([0]);
  });

  test('emits before the source ends', () => {
    // The point of the lazy version: a prefix is available without reading
    // the whole source.
    const seen: number[] = [];
    expect(
      toArrayIter(takeIter(uniqueIter(counting([1, 1, 2, 3], seen)), 2)),
    ).toEqual([1, 2]);
    expect(seen).toEqual([1, 1, 2]);
  });

  test('works on an infinite source', () => {
    expect(
      toArrayIter(takeIter(uniqueIter(concatIter([1, 1, 2], naturals())), 3)),
    ).toEqual([1, 2, 0]);
  });
});

describe('Iter > concatIter', () => {
  test('yields each source in turn', () => {
    expect(toArrayIter(concatIter(syncGen([1, 2]), syncGen([3, 4])))).toEqual([
      1, 2, 3, 4,
    ]);
  });

  test('accepts any iterable, not only generators', () => {
    expect(toArrayIter(concatIter('ab', [1, 2]))).toEqual(['a', 'b', 1, 2]);
  });

  test('yields nothing for no sources', () => {
    expect(toArrayIter(concatIter())).toEqual([]);
  });

  test('skips empty sources', () => {
    expect(toArrayIter(concatIter([], [1], []))).toEqual([1]);
  });

  test('never touches a later source when the consumer stops early', () => {
    const seen: number[] = [];
    toArrayIter(takeIter(concatIter([1, 2], counting([3, 4], seen)), 1));

    expect(seen).toEqual([]);
  });
});
