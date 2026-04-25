import { color } from '../../src';

describe('Colors > color', () => {
  describe('Input parsing', () => {
    test('Hex strings', () => {
      expect(color('#ff0000', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color('#f00', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color('#ff000080', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    });

    test('Color names', () => {
      expect(color('red', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color('blue', 'rgba-object')).toEqual({ r: 0, g: 0, b: 255, a: 1 });
    });

    test('RGB strings', () => {
      expect(color('rgb(255, 0, 0)', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color('rgba(255, 0, 0, 0.5)', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    });

    test('HSL strings', () => {
      expect(color('hsl(0, 100%, 50%)', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color('hsla(0, 100%, 50%, 0.5)', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    });

    test('Numbers', () => {
      expect(color(0xff0000, 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    });

    test('Arrays', () => {
      expect(color([255, 0, 0], 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color([255, 0, 0, 0.5], 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    });

    test('Objects', () => {
      expect(color({ r: 255, g: 0, b: 0 }, 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color({ h: 0, s: 100, l: 50 }, 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    });
  });

  describe('Output formats', () => {
    const red = { r: 255, g: 0, b: 0, a: 1 };

    test('hex', () => {
      expect(color(red, 'hex')).toBe('#ff0000');
      expect(color({ ...red, a: 0.5 }, 'hex')).toBe('#ff000080');
    });

    test('rgb/rgba', () => {
      expect(color(red, 'rgb')).toBe('rgb(255, 0, 0)');
      expect(color({ ...red, a: 0.5 }, 'rgba')).toBe('rgba(255, 0, 0, 0.5)');
    });

    test('hsl/hsla', () => {
      expect(color(red, 'hsl')).toBe('hsl(0, 100%, 50%)');
      expect(color({ ...red, a: 0.5 }, 'hsla')).toBe('hsla(0, 100%, 50%, 0.5)');
    });

    test('rgba-object/array', () => {
      expect(color(red, 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color(red, 'rgba-array')).toEqual([255, 0, 0, 1]);
    });

    test('hsla-object/array', () => {
      expect(color(red, 'hsla-object')).toEqual({ h: 0, s: 100, l: 50, a: 1 });
      expect(color(red, 'hsla-array')).toEqual([0, 100, 50, 1]);
    });
  });

  test('Invalid input', () => {
    expect(color('invalid', 'hex')).toBeNull();
    expect(color({}, 'hex')).toBeNull();
  });
});
