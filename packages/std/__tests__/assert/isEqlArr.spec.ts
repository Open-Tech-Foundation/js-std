import { isEqlArr } from '../../src';

describe('Assert > isEqlArr', () => {
  test('same ordered arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(isEqlArr(arr1, arr2)).toBe(true);
  });

  test('sparse arrays', () => {
    expect(isEqlArr([1, undefined, 2], [1, undefined, 2])).toBe(true);
    // biome-ignore lint/suspicious/noSparseArray: Intentional for testing
    expect(isEqlArr([1, undefined, 3], [1, , 3])).toBe(false);
    expect(
      isEqlArr(
        [1, 2, 3, undefined, 5, undefined],
        [undefined, 5, 2, 1, undefined, 3],
      ),
    ).toBe(true);
  });

  test('diff ordered same arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [2, 1, 3];
    expect(isEqlArr(arr1, arr2)).toBe(true);
  });

  test('not equal length', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3, 4];
    expect(isEqlArr(arr1, arr2)).toBe(false);
  });

  test('equal length but diff values', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 5];
    expect(isEqlArr(arr1, arr2)).toBe(false);
  });

  test('equal length but diff primitive type of values', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, '3'];
    expect(isEqlArr(arr1, arr2)).toBe(false);
  });

  test('objects', () => {
    let arr1: unknown[] = [{ a: 1 }, { b: 2 }, [1, 'a', null], undefined, null];
    let arr2: unknown[] = [undefined, null, [1, 'a', null], { b: 2 }, { a: 1 }];
    expect(isEqlArr(arr1, arr2)).toBe(true);

    arr1 = [[1, 'a', null], { b: 2 }, undefined, { a: 1 }, null];
    arr2 = [[1, 'a', null], { b: 2 }, undefined, { a: 1 }, null];
    expect(isEqlArr(arr1, arr2)).toBe(true);

    arr1 = [{ a: [1, undefined, 2] }];
    // biome-ignore lint/suspicious/noSparseArray: Intentional for testing
    arr2 = [{ a: [1, , 2] }];
    expect(isEqlArr(arr1, arr2)).toBe(false);
  });
});
