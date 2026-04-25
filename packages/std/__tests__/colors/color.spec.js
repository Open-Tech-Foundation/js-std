import { color, ColorFormat } from '../../src';

describe('Colors > color', () => {
  describe('Input parsing (Standard)', () => {
    test('Hex strings', () => {
      expect(color('#ff0000', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color('#f00', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color('#ff000080', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    });

    test('Color names', () => {
      expect(color('red', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color('AliceBlue', 'hex')).toBe('#f0f8ff');
      expect(color('rebeccapurple', 'hex')).toBe('#663399');
    });

    test('RGB strings', () => {
      expect(color('rgb(255, 0, 0)', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color('rgba(255, 0, 0, 0.5)', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    });

    test('HSL strings', () => {
      expect(color('hsl(0, 100%, 50%)', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color('hsla(0, 100%, 50%, 0.5)', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    });
  });

  describe('Edge Cases & Robustness', () => {
    test('Weird spacing', () => {
      expect(color('  #ff0000  ', 'hex')).toBe('#ff0000');
      expect(color(' rgb( 255 , 0 , 0 ) ', 'rgb')).toBe('rgb(255, 0, 0)');
      expect(color('hsla( 0 , 100% , 50% , 0.5 )', 'hsla')).toBe('hsla(0, 100%, 50%, 0.5)');
    });

    test('Mixed case', () => {
      expect(color('rGb(255,0,0)', 'hex')).toBe('#ff0000');
      expect(color('HSLA(0,100%,50%,1)', 'hex')).toBe('#ff0000');
    });

    test('Out of range values (Clamping)', () => {
      // RGB > 255
      expect(color('rgb(300, 0, 0)', 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      // Alpha > 1
      expect(color('rgba(0,0,0,2)', 'rgba-object')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
      // HSL > limits (Note: white results in h:0, s:0, l:100)
      expect(color('hsl(400, 150%, 150%)', 'hsla-object')).toEqual({ h: 0, s: 0, l: 100, a: 1 });
      // Objects/Arrays out of range
      expect(color({ r: 500, g: -10, b: 0 }, 'rgba-object')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color([0, 0, 0, 5], 'rgba-object')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    });
  });

  describe('Error Handling', () => {
    test('Throws on invalid color strings', () => {
      expect(() => color('invalid', 'hex')).toThrow('Invalid Color');
      expect(() => color('#zzzzzz', 'hex')).toThrow('Invalid Color');
      expect(() => color('rgb(a,b,c)', 'hex')).toThrow('Invalid Color');
    });

    test('Throws on invalid objects', () => {
      expect(() => color({}, 'hex')).toThrow('Invalid Color');
      expect(() => color({ x: 1 }, 'hex')).toThrow('Invalid Color');
    });

    test('Throws on invalid format', () => {
      expect(() => color('red', 'invalid-format')).toThrow('Invalid format');
    });
  });

  describe('Output formats', () => {
    const red = { r: 255, g: 0, b: 0, a: 1 };

    test('hex', () => {
      expect(color(red, ColorFormat.HEX)).toBe('#ff0000');
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

    test('css (smart format)', () => {
      expect(color(red, 'css')).toBe('red');
      expect(color('#f0f8ff', 'css')).toBe('aliceblue');
      expect(color({ ...red, a: 0.5 }, 'css')).toBe('rgba(255, 0, 0, 0.5)');
      expect(color('#123456', 'css')).toBe('#123456');
    });
  });
});
