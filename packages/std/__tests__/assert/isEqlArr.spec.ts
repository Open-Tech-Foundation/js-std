import { isEqlArr } from '../../src';

describe('Assert > isEqlArr', () => {
  test('same ordered arrays', () => {
    const arr1 = [1, 2, 3, 4];
    const arr2 = [1, 2, 3, 4];
    expect(isEqlArr(arr1, arr2)).toBe(true);
  });

  test('sparse arrays', () => {
    expect(isEqlArr([1, , 2], [1, , 2])).toBe(true);
    expect(isEqlArr([1, , 3], [1, 2, 3])).toBe(false);
    expect(isEqlArr([1, , 3, , ,], [1, , 3, , ,])).toBe(true);
    expect(isEqlArr([1, , 2], [1, undefined, 2])).toBe(false);
    expect(isEqlArr([1, , 2, undefined], [1, , undefined, 2])).toBe(true);
  });

  test('diff ordered same arrays', () => {
    const arr1 = [1, 2, 3, 4];
    const arr2 = [1, 2, 4, 3];
    expect(isEqlArr(arr1, arr2)).toBe(true);
  });

  test('not equal length', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4, 3];
    expect(isEqlArr(arr1, arr2)).toBe(false);
  });

  test('equal length but diff values', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];
    expect(isEqlArr(arr1, arr2)).toBe(false);
  });

  test('equal length but diff primitive type of values', () => {
    const arr1 = [false, null, '2'];
    const arr2 = [null, '2', false];
    expect(isEqlArr(arr1, arr2)).toBe(true);
    const a = [1, 3, 3, undefined];
    const b = [1, 3, undefined, undefined];
    expect(isEqlArr(a, b)).toBe(false);
  });

  test('objects', () => {
    let arr1 = [{ a: 1 }, { b: 2 }];
    let arr2 = [{ b: 2 }, { a: 1 }];
    expect(isEqlArr(arr1, arr2)).toBe(true);

    arr1 = [{ a: 1 }, null, { b: 2 }, undefined, [1, 'a', null]];
    arr2 = [[1, 'a', null], { b: 2 }, undefined, { a: 1 }, null];
    expect(isEqlArr(arr1, arr2)).toBe(true);

    arr1 = [{ a: [1, , 2] }];
    arr2 = [{ a: [1, undefined, 2] }];
    expect(isEqlArr(arr1, arr2)).toBe(false);
  });
});
