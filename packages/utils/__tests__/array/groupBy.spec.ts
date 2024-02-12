import { groupBy } from '../../src';

describe('Array', () => {
  test('groupBy', () => {
    expect(groupBy([])).toEqual({});

    expect(groupBy(['a'])).toEqual({ undefined: ['a'] });

    const products = [
      { name: 'apples', category: 'fruits' },
      { name: 'oranges', category: 'fruits' },
      { name: 'potatoes', category: 'vegetables' },
    ];
    expect(groupBy(products, 'category')).toEqual({
      fruits: [
        { name: 'apples', category: 'fruits' },
        { name: 'oranges', category: 'fruits' },
      ],
      vegetables: [{ name: 'potatoes', category: 'vegetables' }],
    });

    expect(
      groupBy([1, 2, 3, 4, 5, 6, 7, 8, 9], (v) =>
        v % 2 === 0 ? 'Even' : 'Odd'
      )
    ).toEqual({ Even: [2, 4, 6, 8], Odd: [1, 3, 5, 7, 9] });

    expect(groupBy(['one', 'two', 'three'], 'length')).toEqual({
      3: ['one', 'two'],
      5: ['three'],
    });

    const inventory = [
      { name: 'asparagus', type: 'vegetables', quantity: 5 },
      { name: 'bananas', type: 'fruit', quantity: 0 },
      { name: 'goat', type: 'meat', quantity: 23 },
      { name: 'cherries', type: 'fruit', quantity: 5 },
      { name: 'fish', type: 'meat', quantity: 22 },
    ];
    expect(groupBy(inventory, ({ type }) => type)).toEqual({
      vegetables: [{ name: 'asparagus', type: 'vegetables', quantity: 5 }],
      fruit: [
        { name: 'bananas', type: 'fruit', quantity: 0 },
        { name: 'cherries', type: 'fruit', quantity: 5 },
      ],
      meat: [
        { name: 'goat', type: 'meat', quantity: 23 },
        { name: 'fish', type: 'meat', quantity: 22 },
      ],
    });
  });
});
