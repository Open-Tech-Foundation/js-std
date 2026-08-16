import { shuffle } from '../../src';

describe('Array > shuffle', () => {
  test('empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  test('single element array', () => {
    expect(shuffle([1])).toEqual([1]);
  });

  test('deterministic shuffling with a mocked crypto source', () => {
    const spy = vi
      .spyOn(globalThis.crypto, 'getRandomValues')
      .mockImplementation((buf) => {
        (buf as unknown as { fill: (v: number) => void }).fill(0);
        return buf;
      });
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);

    expect(result).toEqual([2, 3, 4, 5, 1]);
    expect(result).toHaveLength(5);
    expect(result).toEqual(expect.arrayContaining(arr));
    expect(arr).toEqual([1, 2, 3, 4, 5]);

    spy.mockRestore();
  });

  test('draws from crypto rather than Math.random', () => {
    const mathSpy = vi.spyOn(Math, 'random');
    const cryptoSpy = vi.spyOn(globalThis.crypto, 'getRandomValues');

    shuffle([1, 2, 3, 4, 5]);

    expect(mathSpy).not.toHaveBeenCalled();
    expect(cryptoSpy).toHaveBeenCalled();

    mathSpy.mockRestore();
    cryptoSpy.mockRestore();
  });

  test('every position is reachable', () => {
    // A Fisher-Yates that draws from the wrong range leaves some element
    // unable to reach some slot, which a single shuffle would not show.
    const seen = new Map<number, Set<number>>([
      [1, new Set()],
      [2, new Set()],
      [3, new Set()],
    ]);

    for (let n = 0; n < 300; n++) {
      shuffle([1, 2, 3]).forEach((v, i) => seen.get(v)?.add(i));
    }

    for (const positions of seen.values()) {
      expect(positions.size).toBe(3);
    }
  });
});
