import {
  color,
  colorLighten,
  colorDarken,
  colorSaturate,
  colorDesaturate,
  colorAlpha,
  colorMix,
  colorGrayscale,
  colorRotateHue,
  colorLuminance,
  colorContrast,
  colorIsReadable,
} from '../../src';

describe('Colors Expansion', () => {
  describe('Numeric Output', () => {
    test('Returns 24-bit integer', () => {
      expect(color('red', 'number')).toBe(0xff0000);
      expect(color('green', 'number')).toBe(0x008000);
      expect(color('blue', 'number')).toBe(0x0000ff);
    });
  });

  describe('Manipulation', () => {
    test('colorLighten', () => {
      expect(colorLighten('#000', 0.5)).toBe('#808080');
      expect(colorLighten('red', 0.2, 'hex')).toBe('#ff6666');
    });

    test('colorDarken', () => {
      expect(colorDarken('#fff', 0.5)).toBe('#808080');
      expect(colorDarken('red', 0.2, 'rgba')).toBe('rgba(153, 0, 0, 1)');
    });

    test('colorSaturate', () => {
      expect(colorSaturate('gray', 0.5)).toBe('#bf4040');
      expect(colorSaturate('gray', 0.5, 'hsl')).toBe('hsl(0, 50%, 50%)');
    });

    test('colorDesaturate', () => {
      expect(colorDesaturate('red', 0.5)).toBe('#bf4040');
      expect(colorDesaturate('red', 0.5, 'rgba-object')).toEqual({ r: 191, g: 64, b: 64, a: 1 });
    });

    test('colorAlpha', () => {
      expect(colorAlpha('red', 0.5)).toBe('#ff000080');
      expect(colorAlpha('red', 0.5, 'rgba')).toBe('rgba(255, 0, 0, 0.5)');
    });

    test('colorMix', () => {
      expect(colorMix('white', 'black')).toBe('#808080');
      expect(colorMix('red', 'blue')).toBe('#800080');
      expect(colorMix('red', 'blue', 0.25)).toBe('#4000bf');
    });

    test('colorGrayscale', () => {
      expect(colorGrayscale('red')).toBe('#808080');
      expect(colorGrayscale('#00ff00')).toBe('#808080');
    });

    test('colorRotateHue', () => {
      expect(colorRotateHue('red', 120)).toBe('#00ff00');
      expect(colorRotateHue('red', -120)).toBe('#0000ff');
    });
  });

  describe('A11y', () => {
    test('colorLuminance', () => {
      expect(colorLuminance('white')).toBe(1);
      expect(colorLuminance('black')).toBe(0);
      expect(colorLuminance('red')).toBe(0.2126);
    });

    test('colorContrast', () => {
      expect(colorContrast('white', 'black')).toBe(21);
      expect(colorContrast('white', 'white')).toBe(1);
      expect(colorContrast('red', 'white')).toBe(4);
    });

    test('colorIsReadable', () => {
      expect(colorIsReadable('black', 'white')).toBe(true);
      expect(colorIsReadable('gray', 'white')).toBe(false); // AA is 4.5
      expect(colorIsReadable('gray', 'white', 'AA_Large')).toBe(true); // AA Large is 3
    });
  });
});
