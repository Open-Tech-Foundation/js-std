import { color } from '../../src';

/**
 * The sRGB primaries and secondaries as CSS Color 4 publishes them.
 *
 * These pin the conversion against an outside source rather than against
 * whatever the implementation happens to produce. Two rows of the
 * sRGB-to-LMS matrix were wrong, and every one of these except red was off:
 * green read `0.8642 0.2899 141.85` instead of `0.8664 0.2948 142.5`. Red is
 * the only colour that cannot catch it — with green and blue at zero, only
 * the first column of each row contributes, and that column was correct.
 */
const SPEC_VALUES: [string, { l: number; c: number; h: number }][] = [
  ['#ff0000', { l: 0.628, c: 0.2577, h: 29.23 }],
  ['#00ff00', { l: 0.8664, c: 0.2948, h: 142.5 }],
  ['#0000ff', { l: 0.452, c: 0.3132, h: 264.05 }],
  ['#00ffff', { l: 0.9054, c: 0.1546, h: 194.77 }],
  ['#ff00ff', { l: 0.7017, c: 0.3225, h: 328.36 }],
  ['#ffff00', { l: 0.968, c: 0.211, h: 109.77 }],
];

describe('Colors > OKLCH conversion', () => {
  test('the primaries and secondaries match the CSS Color 4 values', () => {
    for (const [hex, expected] of SPEC_VALUES) {
      expect(color({ value: hex, to: 'oklch-object' })).toEqual({
        ...expected,
        a: 1,
      });
    }
  });

  test('white and black sit at the ends of the lightness axis', () => {
    expect(color({ value: '#ffffff', to: 'oklch-object' })).toEqual({
      l: 1,
      c: 0,
      h: 89.88,
      a: 1,
    });
    expect(color({ value: '#000000', to: 'oklch-object' })).toEqual({
      l: 0,
      c: 0,
      h: 0,
      a: 1,
    });
  });

  test('a neutral grey has no chroma', () => {
    expect(color({ value: '#808080', to: 'oklch-object' }).c).toBe(0);
    expect(color({ value: '#404040', to: 'oklch-object' }).c).toBe(0);
  });

  test('every channel value survives a round trip', () => {
    // A colour whose channels are all distinct catches a transposed row that
    // the primaries, with their zeros, would let through.
    for (const hex of [
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffffff',
      '#000000',
      '#808080',
      '#3366cc',
      '#123456',
      '#ff8800',
      '#00ffff',
      '#ff00ff',
      '#ffff00',
    ]) {
      expect(
        color({ value: color({ value: hex, to: 'oklch-object' }), to: 'hex' }),
      ).toBe(hex);
    }
  });

  test('the oklch string round trips too', () => {
    for (const hex of ['#00ff00', '#3366cc', '#123456', '#ff8800']) {
      expect(
        color({ value: color({ value: hex, to: 'oklch' }), to: 'hex' }),
      ).toBe(hex);
    }
  });

  test('a full sweep of the hue circle round trips', () => {
    for (let h = 0; h < 360; h += 5) {
      const hex = color({ value: { h, s: 70, l: 45 }, to: 'hex' });
      expect(
        color({ value: color({ value: hex, to: 'oklch-object' }), to: 'hex' }),
      ).toBe(hex);
    }
  });

  test('alpha is carried through untouched', () => {
    expect(color({ value: '#00ff0080', to: 'oklch-object' })).toEqual({
      l: 0.8664,
      c: 0.2948,
      h: 142.5,
      a: 0.5,
    });
    expect(
      color({
        value: {
          ...color({ value: '#00ff00', to: 'oklch-object' }),
          a: 0.5,
        },
        to: 'rgba',
      }),
    ).toBe('rgba(0, 255, 0, 0.5)');
  });

  test('an oklch string parses back to the colour it names', () => {
    expect(color({ value: 'oklch(0.8664 0.2948 142.5)', to: 'hex' })).toBe(
      '#00ff00',
    );
    expect(color({ value: 'oklch(0.452 0.3132 264.05)', to: 'hex' })).toBe(
      '#0000ff',
    );
    expect(
      color({ value: 'oklch(0.8664 0.2948 142.5 / 0.5)', to: 'rgba' }),
    ).toBe('rgba(0, 255, 0, 0.5)');
  });

  test('a colour outside the sRGB gamut is clamped, not left as NaN', () => {
    // Maximum chroma at a lightness sRGB cannot reach that far out.
    const rgba = color({
      value: { l: 0.9, c: 0.4, h: 200 },
      to: 'rgba-object',
    });

    for (const channel of [rgba.r, rgba.g, rgba.b]) {
      expect(Number.isNaN(channel)).toBe(false);
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(255);
    }
  });
});
