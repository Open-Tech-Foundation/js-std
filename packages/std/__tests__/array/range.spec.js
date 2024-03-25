import { range } from '../../src';

describe('Array > range', () => {
  test('Error handling: Type Mismatch', () => {
    const sharedMatrix = [
      [],
      [0],
      [0n],
      [0, 1, function () {}],
      [0n, 1n, function () {}],
      [0, function () {}, 2],
      [function () {}, 2, 2],
      [0n, 1],
      [0n, 1, 1],
      [0n, 1, { step: 1 }],
      [0, 1n],
      [0, 1n, 1],
      [0, 1n, { step: 1 }],
      [0, 1, 1n],
      [0, 1, { step: 1n }],
    ];
    for (const each of sharedMatrix) {
      expect(() => range(...each)).toThrowError();
    }
  });

  test('empty', () => {
    expect(range(0, 0)).toEqual([]);
    expect(range(0, -5, 1)).toEqual([]);
  });

  test('positive integers', () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
    expect(range(1, 2)).toEqual([1]);
    expect(range(1, 2, { step: 1 })).toEqual([1]);
    expect(range(10, 50, { step: 10 })).toEqual([10, 20, 30, 40]);
    expect(range(10, 50, 10)).toEqual([10, 20, 30, 40]);
    expect(range(3, 9, { step: 3 })).toEqual([3, 6]);
  });

  test('negative integers', () => {
    expect(range(0, -5)).toEqual([0, -1, -2, -3, -4]);
    expect(range(0, -4, { step: -1 })).toEqual([0, -1, -2, -3]);
    expect(range(-1, 5)).toEqual([-1, 0, 1, 2, 3, 4]);
    expect(range(0, -5, { step: -1 })).toEqual([0, -1, -2, -3, -4]);
    expect(range(-1, -2)).toEqual([-1]);
    expect(range(-1, -2, { step: -1 })).toEqual([-1]);
    expect(range(-10, -5)).toEqual([-10, -9, -8, -7, -6]);
  });

  test('decimal', () => {
    expect(range(10, 12, { step: 0.5 })).toEqual([10, 10.5, 11, 11.5]);
    expect(range(0, 1, { step: 0.1 })).toEqual([
      0, 0.1, 0.2, 0.30000000000000004, 0.4, 0.5, 0.6000000000000001,
      0.7000000000000001, 0.8, 0.9,
    ]);
  });

  test('inclusive true', () => {
    expect(range(0, 5, { inclusive: true })).toEqual([0, 1, 2, 3, 4, 5]);
    expect(range(-1, -2, { step: -1, inclusive: true })).toEqual([-1, -2]);
  });

  test('Use with for of loop', () => {
    const res = [];
    for (const item of range(1, 5)) {
      res.push(item);
    }
    expect(res).toEqual([1, 2, 3, 4]);
  });

  test('NaN', () => {
    expect(() => range(NaN, 0)).toThrowError();
    expect(() => range(0, NaN)).toThrowError();
    expect(() => range(NaN, NaN)).toThrowError();

    expect(() => range(0, 0, { step: NaN })).toThrowError();
    expect(() => range(0, 5, NaN)).toThrowError();
  });

  test('Step infer', () => {
    expect(range(0, -2)).toEqual([0, -1]);
    expect(range(0, -2, { inclusive: true })).toEqual([0, -1, -2]);
  });

  test('Error: Zero as step', () => {
    expect(() => range(0, 10, 0)).toThrowError();
    expect(() => range(0, 10, { step: 0 })).toThrowError();
    expect(() => range(0n, 10n, 0n)).toThrowError();
    expect(() => range(0n, 10n, { step: 0n })).toThrowError();
  });

  test('Error: Infinity as start / step', () => {
    expect(() => range(Infinity, 10, 0)).toThrowError();
    expect(() => range(-Infinity, 10, 0)).toThrowError();
    expect(() => range(0, 10, Infinity)).toThrowError();
    expect(() => range(0, 10, { step: Infinity })).toThrowError();
  });

  test('Inclusive on same start-end', () => {
    expect(range(0, 0, { inclusive: false })).toEqual([]);
    expect(range(0, 0, { inclusive: true })).toEqual([0]);
  });
});
