import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import { stringSplice } from '../../src';

describe('String > stringSplice', () => {
  test('replaces a range', () => {
    expect(
      stringSplice('2026-07-30', 5, { deleteCount: 2, insert: '08' }),
    ).toBe('2026-08-30');
    expect(stringSplice('v1.4.0', 3, { deleteCount: 1, insert: '5' })).toBe(
      'v1.5.0',
    );
    // The replacement need not be the length of what it removes.
    expect(
      stringSplice('4111111111111111', 4, { deleteCount: 8, insert: '••••' }),
    ).toBe('4111••••1111');
    expect(
      stringSplice('/home/ada/projects/std/src/index.ts', 6, {
        deleteCount: 20,
        insert: '…',
      }),
    ).toBe('/home/…/index.ts');
    expect(stringSplice('abcdef', 2, { deleteCount: 2, insert: 'XY' })).toBe(
      'abXYef',
    );
  });

  test('inserts when nothing is removed', () => {
    expect(
      stringSplice('SELECT * FROM users', 19, {
        deleteCount: 0,
        insert: ' LIMIT 10',
      }),
    ).toBe('SELECT * FROM users LIMIT 10');
    expect(
      stringSplice('  const x = 1', 2, { deleteCount: 0, insert: '// ' }),
    ).toBe('  // const x = 1');
    expect(stringSplice('abc', 0, { deleteCount: 0, insert: 'z' })).toBe(
      'zabc',
    );
    expect(stringSplice('abc', 3, { deleteCount: 0, insert: 'd' })).toBe(
      'abcd',
    );
  });

  test('deletes when nothing is inserted', () => {
    expect(stringSplice('2026-07-30T09:15:00Z', -1, { deleteCount: 1 })).toBe(
      '2026-07-30T09:15:00',
    );
    expect(stringSplice('abc', 1, { deleteCount: 1 })).toBe('ac');
    expect(stringSplice('abcdef', 1, { deleteCount: 4 })).toBe('af');
    expect(stringSplice('abc', 0, { deleteCount: 0 })).toBe('abc');
  });

  test('removes to the end when deleteCount is omitted', () => {
    const url = 'https://example.com/search?q=std&page=2';
    expect(stringSplice(url, url.indexOf('?'))).toBe(
      'https://example.com/search',
    );
    expect(stringSplice('abcdef', 2)).toBe('ab');
    expect(stringSplice('abcdef', 0)).toBe('');
    expect(
      stringSplice('abcdef', 2, { deleteCount: undefined, insert: 'XY' }),
    ).toBe('abXY');
  });

  test('counts a negative start from the end', () => {
    expect(
      stringSplice('report.txt', -3, { deleteCount: 3, insert: 'csv' }),
    ).toBe('report.csv');
    expect(stringSplice('abcdef', -2, { deleteCount: 2, insert: 'XY' })).toBe(
      'abcdXY',
    );
    expect(stringSplice('abcdef', -1)).toBe('abcde');
    expect(stringSplice('abcdef', -3, { deleteCount: 1, insert: 'X' })).toBe(
      'abcXef',
    );
    // Clamped at the start of the string, as Array.prototype.splice does.
    expect(stringSplice('abc', -10, { deleteCount: 1, insert: 'X' })).toBe(
      'Xbc',
    );
  });

  test('clamps out of range positions', () => {
    expect(stringSplice('abc', 10, { deleteCount: 5, insert: 'd' })).toBe(
      'abcd',
    );
    expect(stringSplice('abc', 1, { deleteCount: 100, insert: 'X' })).toBe(
      'aX',
    );
    expect(stringSplice('', 0, { deleteCount: 0, insert: 'a' })).toBe('a');
    expect(stringSplice('', 5, { deleteCount: 5, insert: 'abc' })).toBe('abc');
  });

  test('uses the defaults', () => {
    expect(stringSplice('abc')).toBe('');
    expect(stringSplice('abc', 1)).toBe('a');
    expect(stringSplice('abc', 1, { deleteCount: 1 })).toBe('ac');
    expect(stringSplice('')).toBe('');
  });

  test('never leaves a lone surrogate behind', () => {
    // The orange occupies code units 1 and 2.
    expect(stringSplice('a🍊b', 1, { deleteCount: 2, insert: 'X' })).toBe(
      'aXb',
    );
    // A boundary inside the pair widens to cover the whole character.
    expect(stringSplice('a🍊b', 2, { deleteCount: 1, insert: 'X' })).toBe(
      'aXb',
    );
    expect(stringSplice('a🍊b', 2, { deleteCount: 0, insert: 'X' })).toBe(
      'aX🍊b',
    );
    expect(stringSplice('a🍊b', 1, { deleteCount: 1, insert: 'X' })).toBe(
      'aXb',
    );
    expect(stringSplice('a🍊b', 0, { deleteCount: 2 })).toBe('b');

    for (const result of [
      stringSplice('a🍊b', 2, { deleteCount: 1, insert: 'X' }),
      stringSplice('a🍊b', 1, { deleteCount: 1, insert: 'X' }),
      stringSplice('a🍊b', 2, { deleteCount: 0, insert: 'X' }),
      stringSplice('🍊🍊', 1, { deleteCount: 2 }),
      stringSplice('🍊🍊', 3),
    ]) {
      // Spreading yields whole code points, so a lone surrogate survives as a
      // single unit in the surrogate range.
      const lone = [...result].some((char) => {
        const code = char.charCodeAt(0);
        return char.length === 1 && code >= 0xd800 && code <= 0xdfff;
      });
      expect(lone).toBe(false);
    }
  });

  test('keeps multi code unit characters intact', () => {
    // A deleteCount of 1 removes the whole emoji, both its code units.
    expect(
      stringSplice('Ship it 🚀', 8, { deleteCount: 1, insert: 'now' }),
    ).toBe('Ship it now');
    expect(stringSplice('😀😃😄😁', 2, { deleteCount: 2, insert: '😎' })).toBe(
      '😀😎😄😁',
    );
    expect(stringSplice('I__JS', 1, { deleteCount: 2, insert: '❤️' })).toBe(
      'I❤️JS',
    );
  });

  test('throws on an invalid start or delete count', () => {
    expect(() => stringSplice('abc', 1.5)).toThrow(
      'Start must be a finite integer.',
    );
    expect(() => stringSplice('abc', Number.NaN)).toThrow(
      'Start must be a finite integer.',
    );
    expect(() => stringSplice('abc', Number.POSITIVE_INFINITY)).toThrow(
      'Start must be a finite integer.',
    );
    expect(() => stringSplice('abc', 0, { deleteCount: -1 })).toThrow(
      'Delete count must be greater than or equal to 0.',
    );
    expect(() => stringSplice('abc', 0, { deleteCount: 1.5 })).toThrow(
      'Delete count must be a finite integer.',
    );
    expect(() =>
      stringSplice('abc', 0, { deleteCount: Number.POSITIVE_INFINITY }),
    ).toThrow('Delete count must be a finite integer.');
  });

  test('matches Array.prototype.splice on plain text', () => {
    const cases: [number, number, string][] = [
      [0, 0, 'X'],
      [2, 2, 'XY'],
      [1, 3, ''],
      [-2, 1, 'Z'],
      [4, 10, 'end'],
    ];

    for (const [start, count, insert] of cases) {
      const chars = [...'abcdef'];
      chars.splice(start, count, ...insert);
      expect(
        stringSplice('abcdef', start, { deleteCount: count, insert: insert }),
      ).toBe(chars.join(''));
    }
  });
});
