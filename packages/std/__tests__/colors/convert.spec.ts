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

import { color } from '../../src';

describe('Colors > color({ value, from, to })', () => {
  describe('arrays', () => {
    // An array is three numbers and an alpha. Nothing in `[220, 60, 50, 1]`
    // says which space they belong to, so `hsla-array` output used to be
    // unreadable: handed straight back it was taken as RGBA and came out as
    // `#dc3c32` instead of the `#3366cc` it was made from.
    test('hsla-array output round trips through from: hsla', () => {
      const hsla = color({ value: '#3366cc', to: 'hsla-array' });

      expect(hsla).toEqual([220, 60, 50, 1]);
      expect(color({ value: hsla, from: 'hsla', to: 'hex' })).toBe('#3366cc');
    });

    test('the same array reads differently under each source format', () => {
      const value: [number, number, number, number] = [220, 60, 50, 1];

      expect(color({ value, from: 'hsla', to: 'hex' })).toBe('#3366cc');
      expect(color({ value, from: 'rgba', to: 'hex' })).toBe('#dc3c32');
    });

    test('an array is RGBA when from is omitted', () => {
      expect(color({ value: [220, 60, 50, 1], to: 'hex' })).toBe('#dc3c32');
      expect(color({ value: [255, 0, 0], to: 'hex' })).toBe('#ff0000');
    });

    test('rgba-array output still round trips without from', () => {
      const rgba = color({ value: '#3366cc', to: 'rgba-array' });

      expect(color({ value: rgba, to: 'hex' })).toBe('#3366cc');
    });

    test('rgb and hsl are accepted as aliases of rgba and hsla', () => {
      expect(color({ value: [51, 102, 204], from: 'rgb', to: 'hex' })).toBe(
        '#3366cc',
      );
      expect(color({ value: [220, 60, 50], from: 'hsl', to: 'hex' })).toBe(
        '#3366cc',
      );
    });

    test('an OKLCH triple reads back as the colour it names', () => {
      expect(
        color({ value: [0.8664, 0.2948, 142.5], from: 'oklch', to: 'hex' }),
      ).toBe('#00ff00');
      expect(
        color({ value: [0.452, 0.3132, 264.05], from: 'oklch', to: 'hex' }),
      ).toBe('#0000ff');
    });

    test('a missing alpha defaults to opaque, a present one is kept', () => {
      expect(color({ value: [220, 60, 50], from: 'hsla', to: 'hex' })).toBe(
        '#3366cc',
      );
      expect(
        color({ value: [220, 60, 50, 0.5], from: 'hsla', to: 'rgba' }),
      ).toBe('rgba(51, 102, 204, 0.5)');
    });

    test('out-of-range components are clamped per source format', () => {
      expect(color({ value: [400, 200, 200], from: 'hsl', to: 'hex' })).toBe(
        color({ value: [360, 100, 100], from: 'hsl', to: 'hex' }),
      );
      expect(color({ value: [300, -20, 50], from: 'rgb', to: 'hex' })).toBe(
        '#ff0032',
      );
    });
  });

  describe('every other input', () => {
    test('a string, number or keyed object converts', () => {
      expect(color({ value: '#3366cc', to: 'rgb' })).toBe('rgb(51, 102, 204)');
      expect(color({ value: 'red', to: 'hex' })).toBe('#ff0000');
      expect(color({ value: 0x3366cc, to: 'hex' })).toBe('#3366cc');
      expect(color({ value: { h: 220, s: 60, l: 50 }, to: 'hex' })).toBe(
        '#3366cc',
      );
      expect(color({ value: { r: 51, g: 102, b: 204 }, to: 'hex' })).toBe(
        '#3366cc',
      );
    });

    // Silently ignoring `from` would leave a caller believing a conversion
    // happened that never did.
    test('from is refused where the value states its own format', () => {
      expect(() => color({ value: '#fff', from: 'hsla', to: 'hex' })).toThrow(
        "color: 'from' applies to array values only; a string states its own format.",
      );
      expect(() =>
        color({ value: { r: 1, g: 2, b: 3 }, from: 'hsla', to: 'hex' }),
      ).toThrow("color: 'from' applies to array values only");
      expect(() => color({ value: 255, from: 'rgb', to: 'hex' })).toThrow(
        "color: 'from' applies to array values only",
      );
    });
  });

  describe('defaults and misuse', () => {
    test('to defaults to hex', () => {
      expect(color({ value: [0, 255, 0] })).toBe('#00ff00');
      expect(color({ value: 'red' })).toBe('#ff0000');
      expect(color({ value: [220, 60, 50, 1], from: 'hsla' })).toBe('#3366cc');
    });

    test('an unknown source format is refused', () => {
      expect(() =>
        color({ value: [1, 2, 3], from: 'lab' as 'rgb', to: 'hex' }),
      ).toThrow("color: invalid 'from' format: lab");
    });

    test('an unknown output format is refused', () => {
      expect(() => color({ value: 'red', to: 'cmyk' as 'hex' })).toThrow(
        'Invalid format: cmyk',
      );
    });

    test('an invalid colour is refused', () => {
      expect(() => color({ value: 'notacolor', to: 'hex' })).toThrow(
        'Invalid Color',
      );
      expect(() => color({ value: '#gggggg', to: 'hex' })).toThrow(
        'Invalid Color',
      );
    });

    // The positional form was the whole API before this change, so the error
    // has to name the replacement rather than fail as an invalid colour.
    test('the old positional form is refused, with a message that says why', () => {
      const call = color as unknown as (i: unknown, f?: unknown) => unknown;

      expect(() => call('#ff0000', 'rgb')).toThrow(
        "color: pass a single object, e.g. color({ value: '#ff0000', to: 'rgb' }).",
      );
      expect(() => call([255, 0, 0], 'hex')).toThrow(
        'color: pass a single object',
      );
      expect(() => call('red')).toThrow('color: pass a single object');
      expect(() => call(null)).toThrow('color: pass a single object');
      expect(() => call(undefined)).toThrow('color: pass a single object');
    });
  });

  describe('output formats', () => {
    test('every format is reachable through the object form', () => {
      const value = '#3366cc';

      expect(color({ value, to: 'hex' })).toBe('#3366cc');
      expect(color({ value, to: 'rgb' })).toBe('rgb(51, 102, 204)');
      expect(color({ value, to: 'rgba' })).toBe('rgba(51, 102, 204, 1)');
      expect(color({ value, to: 'hsl' })).toBe('hsl(220, 60%, 50%)');
      expect(color({ value, to: 'hsla' })).toBe('hsla(220, 60%, 50%, 1)');
      expect(color({ value, to: 'oklch' })).toBe('oklch(0.5325 0.1679 262.29)');
      expect(color({ value, to: 'css' })).toBe('#3366cc');
      expect(color({ value, to: 'number' })).toBe(0x3366cc);
      expect(color({ value, to: 'rgba-object' })).toEqual({
        r: 51,
        g: 102,
        b: 204,
        a: 1,
      });
      expect(color({ value, to: 'rgba-array' })).toEqual([51, 102, 204, 1]);
      expect(color({ value, to: 'hsla-object' })).toEqual({
        h: 220,
        s: 60,
        l: 50,
        a: 1,
      });
      expect(color({ value, to: 'hsla-array' })).toEqual([220, 60, 50, 1]);
      expect(color({ value, to: 'ansi' })).toBe('\x1b[38;2;51;102;204m');
    });
  });
});
