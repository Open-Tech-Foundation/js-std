import {
  colorAlpha,
  colorDarken,
  colorDesaturate,
  colorLighten,
  colorMix,
  colorRotateHue,
  colorSaturate,
} from '../../src';

/** Each adjuster with the name of the number it takes. */
const ADJUSTERS: [string, (amount: number) => unknown, string][] = [
  ['colorLighten', (n) => colorLighten('#3366cc', n), 'amount'],
  ['colorDarken', (n) => colorDarken('#3366cc', n), 'amount'],
  ['colorSaturate', (n) => colorSaturate('#3366cc', n), 'amount'],
  ['colorDesaturate', (n) => colorDesaturate('#3366cc', n), 'amount'],
  ['colorRotateHue', (n) => colorRotateHue('#3366cc', n), 'degrees'],
  ['colorAlpha', (n) => colorAlpha('#3366cc', n), 'amount'],
  ['colorMix', (n) => colorMix('#3366cc', '#000000', n), 'weight'],
];

describe('Colors > a non-finite amount is refused', () => {
  // The colour argument was always validated — `color` throws `Invalid Color`
  // for anything it cannot read — but the number was not, and each adjuster
  // failed differently: `#NaNNaNNaN` from the lightness, saturation and mix
  // paths, `#333333` from a hue rotation (a real colour, but not the one
  // passed in), and a silently opaque result from an alpha of `NaN`.
  for (const [name, run, param] of ADJUSTERS) {
    describe(name, () => {
      test('rejects NaN', () => {
        expect(() => run(Number.NaN)).toThrow(RangeError);
        expect(() => run(Number.NaN)).toThrow(
          `The ${param} must be a finite number.`,
        );
      });

      test('rejects both infinities', () => {
        expect(() => run(Number.POSITIVE_INFINITY)).toThrow(RangeError);
        expect(() => run(Number.NEGATIVE_INFINITY)).toThrow(RangeError);
      });

      test('never returns a string that is not a colour', () => {
        for (const bad of [
          Number.NaN,
          Number.POSITIVE_INFINITY,
          Number.NEGATIVE_INFINITY,
        ]) {
          let result: unknown;

          try {
            result = run(bad);
          } catch {
            continue;
          }

          expect(String(result)).not.toContain('NaN');
        }
      });
    });
  }

  describe('ordinary amounts are untouched', () => {
    test('each adjuster still produces a colour', () => {
      expect(colorLighten('#3366cc', 0.2)).toBe('#85a3e0');
      expect(colorDarken('#3366cc', 0.2)).toBe('#1f3d7a');
      expect(colorSaturate('#3366cc', 0.2)).toBe('#195de6');
      expect(colorDesaturate('#3366cc', 0.2)).toBe('#4d6eb3');
      expect(colorRotateHue('#3366cc', 180)).toBe('#cc9933');
      expect(colorAlpha('#3366cc', 0.2)).toBe('#3366cc33');
      expect(colorMix('#ffffff', '#000000', 0.5)).toBe('#808080');
    });

    test('out-of-range but finite amounts still clamp rather than throw', () => {
      expect(colorLighten('#3366cc', 500)).toBe('#ffffff');
      expect(colorDarken('#3366cc', 500)).toBe('#000000');
      expect(colorAlpha('#3366cc', 5)).toBe('#3366cc');
      expect(colorAlpha('#3366cc', -1)).toBe('#3366cc00');
      expect(colorRotateHue('#3366cc', 720)).toBe('#3366cc');
      expect(colorRotateHue('#3366cc', -360)).toBe('#3366cc');
    });

    test('zero is a valid amount, not a missing one', () => {
      expect(colorLighten('#3366cc', 0)).toBe('#3366cc');
      expect(colorRotateHue('#3366cc', 0)).toBe('#3366cc');
      expect(colorMix('#ffffff', '#000000', 0)).toBe('#000000');
      expect(colorMix('#ffffff', '#000000', 1)).toBe('#ffffff');
    });

    test("colorMix's weight still defaults to an even mix", () => {
      expect(colorMix('#ffffff', '#000000')).toBe('#808080');
    });
  });
});
