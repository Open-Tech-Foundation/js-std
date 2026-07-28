import { invert, keyBy, runningReduce, slidingWindows } from '../../src';

describe('keyBy', () => {
  const users = [
    { id: 'a1', name: 'Ada' },
    { id: 'b2', name: 'Linus' },
  ];

  test('indexes by a property name', () => {
    expect(keyBy(users, 'id')).toEqual({
      a1: { id: 'a1', name: 'Ada' },
      b2: { id: 'b2', name: 'Linus' },
    });
  });

  test('indexes by an iteratee', () => {
    expect(keyBy(users, (u) => u.name.toLowerCase())).toEqual({
      ada: { id: 'a1', name: 'Ada' },
      linus: { id: 'b2', name: 'Linus' },
    });
  });

  test('passes the index and array to the iteratee', () => {
    const seen: [number, number][] = [];

    keyBy([10, 20], (val, index, arr) => {
      seen.push([index, arr.length]);
      return String(val);
    });

    expect(seen).toEqual([
      [0, 2],
      [1, 2],
    ]);
  });

  test('keeps the last element when keys collide', () => {
    const rows = [
      { id: 1, v: 'old' },
      { id: 1, v: 'new' },
    ];

    expect(keyBy(rows, 'id')).toEqual({ '1': { id: 1, v: 'new' } });
  });

  test('coerces keys to strings', () => {
    expect(keyBy([6.1, 4.2], Math.floor)).toEqual({ '4': 4.2, '6': 6.1 });
  });

  test('gives one element per key, unlike groupBy', () => {
    const result = keyBy(users, 'id');

    expect(Array.isArray(result.a1)).toBe(false);
    expect(result.a1.name).toBe('Ada');
  });

  test('handles empty and default input', () => {
    expect(keyBy([], 'id')).toEqual({});
    expect(keyBy(undefined as never, 'id')).toEqual({});
  });
});

describe('slidingWindows', () => {
  test('slides a window one element at a time', () => {
    expect(slidingWindows([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
    ]);
  });

  test('overlaps, unlike chunk', () => {
    expect(slidingWindows([1, 2, 3, 4, 5], 3)).toEqual([
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
    ]);
  });

  test('returns whole windows only', () => {
    expect(slidingWindows([1, 2], 3)).toEqual([]);
    expect(slidingWindows([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    // 4 elements, window 3 -> two whole windows, the last element is not
    // dropped because it appears in the final window.
    expect(slidingWindows([1, 2, 3, 4], 3)).toEqual([
      [1, 2, 3],
      [2, 3, 4],
    ]);
  });

  test('produces one window per element at size 1', () => {
    expect(slidingWindows([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  test('produces one window when the size matches the length', () => {
    expect(slidingWindows([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
  });

  test('returns the expected number of windows', () => {
    for (let length = 0; length <= 12; length++) {
      const arr = Array.from({ length }, (_, i) => i);

      for (let size = 1; size <= 5; size++) {
        const expected = Math.max(0, length - size + 1);
        expect(slidingWindows(arr, size).length).toBe(expected);
      }
    }
  });

  test('does not alias the source array', () => {
    const arr = [1, 2, 3];
    const windows = slidingWindows(arr, 2);

    windows[0][0] = 99;

    expect(arr).toEqual([1, 2, 3]);
  });

  test('handles empty and default input', () => {
    expect(slidingWindows([], 2)).toEqual([]);
    expect(slidingWindows()).toEqual([]);
  });

  test('rejects an invalid size', () => {
    expect(() => slidingWindows([1, 2], 0)).toThrow();
    expect(() => slidingWindows([1, 2], -1)).toThrow();
    expect(() => slidingWindows([1, 2], 1.5)).toThrow();
  });

  test('computes deltas between neighbours', () => {
    const readings = [10, 13, 12, 20];
    const deltas = slidingWindows(readings, 2).map(([a, b]) => b - a);

    expect(deltas).toEqual([3, -1, 8]);
  });
});

describe('runningReduce', () => {
  test('keeps every intermediate result', () => {
    expect(runningReduce([1, 2, 3, 4], (acc, cur) => acc + cur, 0)).toEqual([
      1, 3, 6, 10,
    ]);
  });

  test('returns an array the same length as the input', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(runningReduce(arr, (acc, cur) => acc + cur, 0).length).toBe(
      arr.length,
    );
  });

  test('ends on the same value reduce would return', () => {
    const arr = [3, 1, 4, 1, 5];
    const running = runningReduce(arr, (acc, cur) => acc + cur, 0);

    expect(running[running.length - 1]).toBe(
      arr.reduce((acc, cur) => acc + cur, 0),
    );
  });

  test('honours the initial value', () => {
    expect(runningReduce([1, 2], (acc, cur) => acc + cur, 100)).toEqual([
      101, 103,
    ]);
  });

  test('passes the index and array to the reducer', () => {
    const seen: [number, number][] = [];

    runningReduce(
      [10, 20],
      (acc, _cur, index, arr) => {
        seen.push([index, arr.length]);
        return acc;
      },
      0,
    );

    expect(seen).toEqual([
      [0, 2],
      [1, 2],
    ]);
  });

  test('accumulates into a type other than the element type', () => {
    expect(
      runningReduce(
        ['a', 'b', 'c'],
        (acc, cur) => [...acc, cur],
        [] as string[],
      ),
    ).toEqual([['a'], ['a', 'b'], ['a', 'b', 'c']]);
  });

  test('handles empty and default input', () => {
    expect(runningReduce([], (acc: number) => acc, 0)).toEqual([]);
    expect(runningReduce(undefined as never, (acc: number) => acc, 0)).toEqual(
      [],
    );
  });

  test('tracks a running balance', () => {
    const transactions = [-20, 50, -5];

    expect(runningReduce(transactions, (bal, t) => bal + t, 100)).toEqual([
      80, 130, 125,
    ]);
  });
});

describe('invert', () => {
  test('swaps keys and values', () => {
    expect(invert({ a: 1, b: 2 })).toEqual({ '1': 'a', '2': 'b' });
    expect(invert({ a: 'x', b: 'y' })).toEqual({ x: 'a', y: 'b' });
  });

  test('builds a reverse lookup from a code table', () => {
    const STATUS = { ok: 200, notFound: 404 };

    expect(invert(STATUS)).toEqual({ '200': 'ok', '404': 'notFound' });
  });

  test('keeps the last key when values collide', () => {
    expect(invert({ a: 1, b: 1 })).toEqual({ '1': 'b' });
  });

  test('coerces values to string keys', () => {
    expect(invert({ a: 1, b: true, c: null })).toEqual({
      '1': 'a',
      true: 'b',
      null: 'c',
    });
  });

  test('round-trips when the values are unique', () => {
    const original = { a: '1', b: '2', c: '3' };

    expect(invert(invert(original))).toEqual(original);
  });

  test('handles an empty object', () => {
    expect(invert({})).toEqual({});
  });

  test('does not mutate the source', () => {
    const source = { a: 1 };
    invert(source);

    expect(source).toEqual({ a: 1 });
  });

  test('ignores inherited properties', () => {
    const parent = { inherited: 'nope' };
    const child = Object.create(parent);
    child.own = 'yes';

    expect(invert(child)).toEqual({ yes: 'own' });
  });
});
