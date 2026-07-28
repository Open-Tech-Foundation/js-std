import { shuffle } from '../../src';

describe('Array > shuffle', () => {
  test('empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  test('single element array', () => {
    expect(shuffle([1])).toEqual([1]);
  });

  test('deterministic shuffling with mocked Math.random', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0);
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);

    expect(result).toEqual([2, 3, 4, 5, 1]);
    expect(result).toHaveLength(5);
    expect(result).toEqual(expect.arrayContaining(arr));
    expect(arr).toEqual([1, 2, 3, 4, 5]);

    spy.mockRestore();
  });
});
