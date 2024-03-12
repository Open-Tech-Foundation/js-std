import { sortObj } from '../../src';

describe('Array > sortObj', () => {
  test('sorting array of objects with one prop', () => {
    const fruits = [
      { name: 'banana', amount: 2 },
      { name: 'apple', amount: 4 },
      { name: 'pineapple', amount: 2 },
      { name: 'mango', amount: 1 },
      { name: 'orange', amount: 5 },
    ];
    const sorted = sortObj(fruits, ['name', 'asc']);
    expect(sorted).toEqual([
      { name: 'apple', amount: 4 },
      { name: 'banana', amount: 2 },
      { name: 'mango', amount: 1 },
      { name: 'orange', amount: 5 },
      { name: 'pineapple', amount: 2 },
    ]);
  });

  test('sorting array of objects with two props', () => {
    const students = [
      { name: 'Alex', grade: 15 },
      { name: 'Devlin', grade: 15 },
      { name: 'Eagle', grade: 13 },
      { name: 'Sam', grade: 14 },
    ];

    let sorted = sortObj(students, ['name', 'asc'], ['grade', 'asc']);
    expect(sorted).toEqual([
      { name: 'Eagle', grade: 13 },
      { name: 'Sam', grade: 14 },
      { name: 'Alex', grade: 15 }, // original maintained for similar grade (stable sorting)
      { name: 'Devlin', grade: 15 },
    ]);

    sorted = sortObj(students, ['name', 'asc'], ['grade', 'desc']);
    expect(sorted).toEqual([
      { name: 'Alex', grade: 15 },
      { name: 'Devlin', grade: 15 },
      { name: 'Sam', grade: 14 },
      { name: 'Eagle', grade: 13 },
    ]);

    sorted = sortObj(students, ['name', 'desc'], ['grade', 'desc']);
    expect(sorted).toEqual([
      { name: 'Devlin', grade: 15 },
      { name: 'Alex', grade: 15 },
      { name: 'Sam', grade: 14 },
      { name: 'Eagle', grade: 13 },
    ]);
  });
});
