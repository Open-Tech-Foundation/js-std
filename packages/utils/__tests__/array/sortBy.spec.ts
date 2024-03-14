import { sortBy } from '../../src';

describe('Array > sortBy', () => {
  test('sorting array of objects with one prop', () => {
    const fruits = [
      { name: 'banana', amount: 2 },
      { name: 'apple', amount: 4 },
      { name: 'pineapple', amount: 2 },
      { name: 'mango', amount: 1 },
      { name: 'orange', amount: 5 },
    ];
    const sorted = sortBy(fruits, ['name', 'asc']);
    expect(sorted).toEqual([
      { name: 'apple', amount: 4 },
      { name: 'banana', amount: 2 },
      { name: 'mango', amount: 1 },
      { name: 'orange', amount: 5 },
      { name: 'pineapple', amount: 2 },
    ]);
    expect(sorted).not.toBe(fruits);
  });

  test('sorting array of objects using cb fn', () => {
    const hotels = [
      { _id: 1, name: 'Central Park Cafe', city: 'Manhattan' },
      { _id: 2, name: 'Rock A Feller Bar and Grill', city: 'Queens' },
      { _id: 3, name: 'Empire State Pub', city: 'Brooklyn' },
      { _id: 4, name: "Stan's Pizzaria", city: 'Manhattan' },
      { _id: 5, name: "Jane's Deli", city: 'Brooklyn' },
    ];
    let sorted = sortBy(hotels, [(obj) => obj.name, 'asc']);
    expect(sorted).toEqual([
      { _id: 1, name: 'Central Park Cafe', city: 'Manhattan' },
      { _id: 3, name: 'Empire State Pub', city: 'Brooklyn' },
      { _id: 5, name: "Jane's Deli", city: 'Brooklyn' },
      { _id: 2, name: 'Rock A Feller Bar and Grill', city: 'Queens' },
      { _id: 4, name: "Stan's Pizzaria", city: 'Manhattan' },
    ]);

    sorted = sortBy(
      hotels,
      [(obj) => obj.city, 'asc'],
      [(obj) => obj.name, 'asc']
    );
    expect(sorted).toEqual([
      { _id: 3, name: 'Empire State Pub', city: 'Brooklyn' },
      { _id: 5, name: "Jane's Deli", city: 'Brooklyn' },
      { _id: 1, name: 'Central Park Cafe', city: 'Manhattan' },
      { _id: 4, name: "Stan's Pizzaria", city: 'Manhattan' },
      { _id: 2, name: 'Rock A Feller Bar and Grill', city: 'Queens' },
    ]);

    sorted = sortBy(
      hotels,
      [(obj) => obj.city, 'asc'],
      [(obj) => obj.name, 'desc']
    );
    expect(sorted).toEqual([
      { _id: 5, name: "Jane's Deli", city: 'Brooklyn' },
      { _id: 3, name: 'Empire State Pub', city: 'Brooklyn' },
      { _id: 4, name: "Stan's Pizzaria", city: 'Manhattan' },
      { _id: 1, name: 'Central Park Cafe', city: 'Manhattan' },
      { _id: 2, name: 'Rock A Feller Bar and Grill', city: 'Queens' },
    ]);
  });

  test('sorting array of objects with two props', () => {
    const students = [
      { name: 'Alex', grade: 15 },
      { name: 'Devlin', grade: 15 },
      { name: 'Eagle', grade: 13 },
      { name: 'Sam', grade: 14 },
    ];

    let sorted = sortBy(students, ['grade', 'asc'], ['name', 'asc']);
    expect(sorted).toEqual([
      { name: 'Eagle', grade: 13 },
      { name: 'Sam', grade: 14 },
      { name: 'Alex', grade: 15 },
      { name: 'Devlin', grade: 15 },
    ]);
    expect(sorted).not.toBe(students);

    sorted = sortBy(students, ['grade', 'asc'], ['name', 'desc']);
    expect(sorted).toEqual([
      { name: 'Eagle', grade: 13 },
      { name: 'Sam', grade: 14 },
      { name: 'Devlin', grade: 15 },
      { name: 'Alex', grade: 15 },
    ]);
  });
});
