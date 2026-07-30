import { formatList } from '../../src';

/** Runs `fn` with `Intl.ListFormat` removed, to exercise the fallback. */
function withoutListFormat(fn: () => void): void {
  const intl = Intl as unknown as Record<string, unknown>;
  const original = intl.ListFormat;

  intl.ListFormat = undefined;
  try {
    fn();
  } finally {
    intl.ListFormat = original;
  }
}

describe('String > formatList', () => {
  test('joins with the connector and its punctuation', () => {
    expect(formatList(['a', 'b', 'c'])).toBe('a, b, and c');
    expect(formatList(['a', 'b'])).toBe('a and b');
    expect(formatList(['a'])).toBe('a');
    expect(formatList([])).toBe('');
    expect(formatList()).toBe('');
  });

  test('varies the connector by type', () => {
    expect(formatList(['a', 'b', 'c'], { type: 'disjunction' })).toBe(
      'a, b, or c',
    );
    expect(formatList(['a', 'b'], { type: 'disjunction' })).toBe('a or b');
    expect(formatList(['a', 'b', 'c'], { type: 'unit' })).toBe('a, b, c');
  });

  test('varies the connector by style', () => {
    expect(formatList(['a', 'b', 'c'], { style: 'short' })).toBe('a, b, & c');
    expect(formatList(['a', 'b'], { style: 'short' })).toBe('a & b');
    expect(formatList(['a', 'b', 'c'], { style: 'narrow' })).toBe('a, b, c');
  });

  test('follows the locale', () => {
    expect(formatList(['a', 'b', 'c'], { locale: 'de-DE' })).toBe('a, b und c');
    expect(formatList(['a', 'b'], { locale: 'es-ES' })).toBe('a y b');
  });

  test('rejects an unknown type or style', () => {
    // @ts-expect-error deliberately not an allowed type
    expect(() => formatList(['a'], { type: 'nope' })).toThrow(RangeError);
    // @ts-expect-error deliberately not an allowed style
    expect(() => formatList(['a'], { style: 'nope' })).toThrow(RangeError);
  });

  describe('without Intl.ListFormat', () => {
    test('produces the same English forms', () => {
      // Recorded from Intl.ListFormat('en') first, so the fallback is held to
      // what the runtimes that do have it produce.
      const cases: [
        string[],
        {
          type?: 'conjunction' | 'disjunction' | 'unit';
          style?: 'long' | 'short' | 'narrow';
        },
        string,
      ][] = [
        [[], {}, ''],
        [['a'], {}, 'a'],
        [['a', 'b'], {}, 'a and b'],
        [['a', 'b', 'c'], {}, 'a, b, and c'],
        [['a', 'b', 'c'], { style: 'short' }, 'a, b, & c'],
        [['a', 'b'], { style: 'short' }, 'a & b'],
        [['a', 'b', 'c'], { style: 'narrow' }, 'a, b, c'],
        [['a', 'b'], { style: 'narrow' }, 'a, b'],
        [['a', 'b', 'c'], { type: 'disjunction' }, 'a, b, or c'],
        [['a', 'b'], { type: 'disjunction' }, 'a or b'],
        [['a', 'b', 'c'], { type: 'unit' }, 'a, b, c'],
        [['a', 'b', 'c'], { type: 'unit', style: 'narrow' }, 'a b c'],
        [['a', 'b'], { type: 'unit', style: 'narrow' }, 'a b'],
      ];

      withoutListFormat(() => {
        for (const [items, options, expected] of cases) {
          expect(formatList(items, options)).toBe(expected);
        }
      });
    });

    test('agrees with Intl.ListFormat where the runtime has it', () => {
      const inputs = [
        [],
        ['a'],
        ['a', 'b'],
        ['a', 'b', 'c'],
        ['a', 'b', 'c', 'd'],
      ];
      const types = ['conjunction', 'disjunction', 'unit'] as const;
      const styles = ['long', 'short', 'narrow'] as const;

      for (const items of inputs) {
        for (const type of types) {
          for (const style of styles) {
            const native = formatList(items, { type, style, locale: 'en' });
            let fallback = '';

            withoutListFormat(() => {
              fallback = formatList(items, { type, style });
            });

            expect(fallback).toBe(native);
          }
        }
      }
    });

    test('still validates its options', () => {
      withoutListFormat(() => {
        // @ts-expect-error deliberately not an allowed type
        expect(() => formatList(['a'], { type: 'nope' })).toThrow(RangeError);
      });
    });
  });
});
