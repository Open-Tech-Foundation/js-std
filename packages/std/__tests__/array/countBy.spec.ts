import { countBy } from '../../src';

describe('Array', () => {
  test('countBy', () => {
    expect(countBy([])).toEqual({});
    expect(
      countBy([1, 2, 3, 4, 5, 6, 7, 8, 9], (v) =>
        v % 2 === 0 ? 'Even' : 'Odd'
      )
    ).toEqual({ Even: 4, Odd: 5 });

    expect(countBy(['Apple', 'Mango', 'Orange'], 'length')).toEqual({
      '5': 2,
      '6': 1,
    });

    const inventory = [
      { name: 'asparagus', type: 'vegetables', qty: 5 },
      { name: 'bananas', type: 'fruit', qty: 0 },
      { name: 'goat', type: 'meat', qty: 23 },
      { name: 'cherries', type: 'fruit', qty: 5 },
      { name: 'fish', type: 'meat', qty: 22 },
    ];
    expect(
      countBy(inventory, ({ qty }) => (qty === 0 ? 'OutOfStock' : 'InStock'))
    ).toEqual({ OutOfStock: 1, InStock: 4 });

    const letters = ['a', 'b', 'A', 'a', 'B', 'c'];

    expect(countBy(letters, (l) => l.toLowerCase())).toEqual({
      a: 3,
      b: 2,
      c: 1,
    });
  });
});
