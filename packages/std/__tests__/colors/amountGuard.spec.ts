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
  [
    'colorLighten',
    (n) => colorLighten({ value: '#3366cc', amount: n }),
    'amount',
  ],
  [
    'colorDarken',
    (n) => colorDarken({ value: '#3366cc', amount: n }),
    'amount',
  ],
  [
    'colorSaturate',
    (n) => colorSaturate({ value: '#3366cc', amount: n }),
    'amount',
  ],
  [
    'colorDesaturate',
    (n) => colorDesaturate({ value: '#3366cc', amount: n }),
    'amount',
  ],
  [
    'colorRotateHue',
    (n) => colorRotateHue({ value: '#3366cc', degrees: n }),
    'degrees',
  ],
  ['colorAlpha', (n) => colorAlpha({ value: '#3366cc', amount: n }), 'amount'],
  [
    'colorMix',
    (n) => colorMix({ color1: '#3366cc', color2: '#000000', weight: n }),
    'weight',
  ],
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
      expect(colorLighten({ value: '#3366cc', amount: 0.2 })).toBe('#85a3e0');
      expect(colorDarken({ value: '#3366cc', amount: 0.2 })).toBe('#1f3d7a');
      expect(colorSaturate({ value: '#3366cc', amount: 0.2 })).toBe('#195de6');
      expect(colorDesaturate({ value: '#3366cc', amount: 0.2 })).toBe(
        '#4d6eb3',
      );
      expect(colorRotateHue({ value: '#3366cc', degrees: 180 })).toBe(
        '#cc9933',
      );
      expect(colorAlpha({ value: '#3366cc', amount: 0.2 })).toBe('#3366cc33');
      expect(
        colorMix({ color1: '#ffffff', color2: '#000000', weight: 0.5 }),
      ).toBe('#808080');
    });

    test('out-of-range but finite amounts still clamp rather than throw', () => {
      expect(colorLighten({ value: '#3366cc', amount: 500 })).toBe('#ffffff');
      expect(colorDarken({ value: '#3366cc', amount: 500 })).toBe('#000000');
      expect(colorAlpha({ value: '#3366cc', amount: 5 })).toBe('#3366cc');
      expect(colorAlpha({ value: '#3366cc', amount: -1 })).toBe('#3366cc00');
      expect(colorRotateHue({ value: '#3366cc', degrees: 720 })).toBe(
        '#3366cc',
      );
      expect(colorRotateHue({ value: '#3366cc', degrees: -360 })).toBe(
        '#3366cc',
      );
    });

    test('zero is a valid amount, not a missing one', () => {
      expect(colorLighten({ value: '#3366cc', amount: 0 })).toBe('#3366cc');
      expect(colorRotateHue({ value: '#3366cc', degrees: 0 })).toBe('#3366cc');
      expect(
        colorMix({ color1: '#ffffff', color2: '#000000', weight: 0 }),
      ).toBe('#000000');
      expect(
        colorMix({ color1: '#ffffff', color2: '#000000', weight: 1 }),
      ).toBe('#ffffff');
    });

    test("colorMix's weight still defaults to an even mix", () => {
      expect(colorMix({ color1: '#ffffff', color2: '#000000' })).toBe(
        '#808080',
      );
    });
  });
});
