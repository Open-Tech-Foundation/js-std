import { stringSplice } from '../../src';

describe('String > stringSplice', () => {
  test('replaces a range', () => {
    expect(stringSplice('abcdef', 2, 2, 'XY')).toBe('abXYef');
    expect(stringSplice('abcdef', 2, 2, 'X')).toBe('abXef');
    expect(stringSplice('abcdef', 2, 2, 'WXYZ')).toBe('abWXYZef');
    expect(stringSplice('I HATE U', 2, 4, 'LUV')).toBe('I LUV U');
    expect(stringSplice('iphone', 0, 1, 'iP')).toBe('iPphone');
  });

  test('inserts when nothing is removed', () => {
    expect(stringSplice('ac', 1, 0, 'b')).toBe('abc');
    expect(stringSplice('foo baz', 3, 0, ' bar')).toBe('foo bar baz');
    expect(stringSplice('abc', 0, 0, 'z')).toBe('zabc');
    expect(stringSplice('abc', 3, 0, 'd')).toBe('abcd');
  });

  test('deletes when nothing is inserted', () => {
    expect(stringSplice('abc', 1, 1)).toBe('ac');
    expect(stringSplice('abcdef', 1, 4)).toBe('af');
    expect(stringSplice('abc', 0, 0)).toBe('abc');
  });

  test('removes to the end when deleteCount is omitted', () => {
    expect(stringSplice('abcdef', 2)).toBe('ab');
    expect(stringSplice('abcdef', 0)).toBe('');
    expect(stringSplice('abcdef', 2, undefined, 'XY')).toBe('abXY');
  });

  test('counts a negative start from the end', () => {
    expect(stringSplice('abcdef', -2, 2, 'XY')).toBe('abcdXY');
    expect(stringSplice('abcdef', -1)).toBe('abcde');
    expect(stringSplice('abcdef', -3, 1, 'X')).toBe('abcXef');
    // Clamped at the start of the string, as Array.prototype.splice does.
    expect(stringSplice('abc', -10, 1, 'X')).toBe('Xbc');
  });

  test('clamps out of range positions', () => {
    expect(stringSplice('abc', 10, 5, 'd')).toBe('abcd');
    expect(stringSplice('abc', 1, 100, 'X')).toBe('aX');
    expect(stringSplice('', 0, 0, 'a')).toBe('a');
    expect(stringSplice('', 5, 5, 'abc')).toBe('abc');
  });

  test('uses the defaults', () => {
    expect(stringSplice('abc')).toBe('');
    expect(stringSplice('abc', 1)).toBe('a');
    expect(stringSplice('abc', 1, 1)).toBe('ac');
    expect(stringSplice('')).toBe('');
  });

  test('never leaves a lone surrogate behind', () => {
    // The orange occupies code units 1 and 2.
    expect(stringSplice('a🍊b', 1, 2, 'X')).toBe('aXb');
    // A boundary inside the pair widens to cover the whole character.
    expect(stringSplice('a🍊b', 2, 1, 'X')).toBe('aXb');
    expect(stringSplice('a🍊b', 2, 0, 'X')).toBe('aX🍊b');
    expect(stringSplice('a🍊b', 1, 1, 'X')).toBe('aXb');
    expect(stringSplice('a🍊b', 0, 2)).toBe('b');

    for (const result of [
      stringSplice('a🍊b', 2, 1, 'X'),
      stringSplice('a🍊b', 1, 1, 'X'),
      stringSplice('a🍊b', 2, 0, 'X'),
      stringSplice('🍊🍊', 1, 2),
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
    expect(stringSplice('I  🍊', 2, 0, 'ate an')).toBe('I ate an 🍊');
    expect(stringSplice('I__JS', 1, 2, '❤️')).toBe('I❤️JS');
    expect(stringSplice('😀😃😄😁', 2, 2, '😎')).toBe('😀😎😄😁');
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
    expect(() => stringSplice('abc', 0, -1)).toThrow(
      'Delete count must be greater than or equal to 0.',
    );
    expect(() => stringSplice('abc', 0, 1.5)).toThrow(
      'Delete count must be a finite integer.',
    );
    expect(() => stringSplice('abc', 0, Number.POSITIVE_INFINITY)).toThrow(
      'Delete count must be a finite integer.',
    );
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
      expect(stringSplice('abcdef', start, count, insert)).toBe(chars.join(''));
    }
  });
});
