import {
  colorParse,
  colorToHex,
  colorToRgb,
  colorToHsl,
  rgbToHsl,
  hslToRgb,
} from '../../src';

describe('Color Utils', () => {
  test('rgbToHsl', () => {
    expect(rgbToHsl(255, 0, 0)).toEqual([0, 100, 50]);
    expect(rgbToHsl(0, 255, 0)).toEqual([120, 100, 50]);
    expect(rgbToHsl(0, 0, 255)).toEqual([240, 100, 50]);
  });

  test('hslToRgb', () => {
    expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]);
    expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]);
    expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]);
  });

  test('colorParse', () => {
    expect(colorParse('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(colorParse('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(colorParse('#ff000080')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    expect(colorParse('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(colorParse('rgba(255, 0, 0, 0.5)')).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 0.5,
    });
    expect(colorParse('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  test('colorToHex', () => {
    expect(colorToHex({ r: 255, g: 0, b: 0, a: 1 })).toBe('#ff0000');
    expect(colorToHex({ r: 255, g: 0, b: 0, a: 0.5 })).toBe('#ff000080');
  });

  test('colorToRgb', () => {
    expect(colorToRgb({ r: 255, g: 0, b: 0, a: 1 })).toBe('rgb(255, 0, 0)');
    expect(colorToRgb({ r: 255, g: 0, b: 0, a: 0.5 })).toBe(
      'rgba(255, 0, 0, 0.5)',
    );
  });

  test('colorToHsl', () => {
    expect(colorToHsl({ r: 255, g: 0, b: 0, a: 1 })).toBe('hsl(0, 100%, 50%)');
    expect(colorToHsl({ r: 255, g: 0, b: 0, a: 0.5 })).toBe(
      'hsla(0, 100%, 50%, 0.5)',
    );
  });
});
