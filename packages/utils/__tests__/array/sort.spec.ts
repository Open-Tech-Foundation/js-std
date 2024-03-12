import { sort } from '../../src';

describe('Array > sort', () => {
  test('empty array', () => {
    const arr = [];
    const sorted = sort(arr);
    expect(sorted).toEqual([]);
    expect(sorted).not.toBe(arr);
  });

  test('default sorting numbers', () => {
    const arr = [40, 1, 5, 200];
    const sorted = sort(arr);
    expect(sorted).toEqual([1, 5, 40, 200]);
  });

  test('asc sorting numbers', () => {
    const arr = [40, 1, 5, 200];
    const sorted = sort(arr, 'asc');
    expect(sorted).toEqual([1, 5, 40, 200]);
  });

  test('desc sorting numbers', () => {
    const arr = [40, 1, 5, 200];
    const sorted = sort(arr, 'desc');
    expect(sorted).toEqual([200, 40, 5, 1]);
  });

  test('default sorting strings', () => {
    const arr = ['Blue', 'Humpback', 'Beluga'];
    const sorted = sort(arr);
    expect(sorted).toEqual(['Beluga', 'Blue', 'Humpback']);
  });

  test('asc sorting strings', () => {
    const arr = ['jan', 'feb', 'mar', 'apr', 'may'];
    const sorted = sort(arr, 'asc');
    expect(sorted).toEqual(['apr', 'feb', 'jan', 'mar', 'may']);
  });

  test('desc sorting strings', () => {
    const arr = ['jan', 'feb', 'mar', 'apr', 'may'];
    const sorted = sort(arr, 'desc');
    expect(sorted).toEqual(['may', 'mar', 'jan', 'feb', 'apr']);
  });
});
