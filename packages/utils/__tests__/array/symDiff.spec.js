import { symDiff } from '../../src';

describe('Array', () => {
  test('symDiff', () => {
    expect(symDiff()).toEqual([]);

    expect(symDiff([])).toEqual([]);

    expect(symDiff([[1, 2, 2, 3, 3, 4], [3, 4, 5]])).toEqual([1, 2, 5]);

    const evens = [2, 4, 6, 8];
    const squares = [1, 4, 9];
    expect(symDiff([evens, squares])).toEqual([2, 6, 8, 1, 9]);

    const bucket1 = ['Fruits', 'Vegs', 'Eggs', 'Cookies', 'Nuts'];
    const bucket2 = ['fruits', 'Snacks', 'cookies'];
    expect(symDiff([bucket1, bucket2], (v) => v.toLowerCase())).toEqual([
      'Vegs',
      'Eggs',
      'Nuts',
      'Snacks',
    ]);
  });
});
