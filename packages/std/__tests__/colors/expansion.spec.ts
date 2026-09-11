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

import {
  color,
  colorAlpha,
  colorContrast,
  colorDarken,
  colorDesaturate,
  colorGrayscale,
  colorInvert,
  colorIsDark,
  colorIsLight,
  colorIsReadable,
  colorLighten,
  colorLuminance,
  colorMix,
  colorRotateHue,
  colorSaturate,
} from '../../src';

describe('Colors Expansion', () => {
  describe('Numeric Output', () => {
    test('Returns 24-bit integer', () => {
      expect(color({ value: 'red', to: 'number' })).toBe(0xff0000);
      expect(color({ value: 'green', to: 'number' })).toBe(0x008000);
      expect(color({ value: 'blue', to: 'number' })).toBe(0x0000ff);
    });
  });

  describe('Manipulation', () => {
    test('colorLighten', () => {
      expect(colorLighten({ value: '#000', amount: 0.5 })).toBe('#808080');
      expect(colorLighten({ value: 'red', amount: 0.2, to: 'hex' })).toBe(
        '#ff6666',
      );
    });

    test('colorDarken', () => {
      expect(colorDarken({ value: '#fff', amount: 0.5 })).toBe('#808080');
      expect(colorDarken({ value: 'red', amount: 0.2, to: 'rgba' })).toBe(
        'rgba(153, 0, 0, 1)',
      );
    });

    test('colorSaturate', () => {
      expect(colorSaturate({ value: 'gray', amount: 0.5 })).toBe('#bf4040');
      expect(colorSaturate({ value: 'gray', amount: 0.5, to: 'hsl' })).toBe(
        'hsl(0, 50%, 50%)',
      );
    });

    test('colorDesaturate', () => {
      expect(colorDesaturate({ value: 'red', amount: 0.5 })).toBe('#bf4040');
      expect(
        colorDesaturate({ value: 'red', amount: 0.5, to: 'rgba-object' }),
      ).toEqual({
        r: 191,
        g: 64,
        b: 64,
        a: 1,
      });
    });

    test('colorAlpha', () => {
      expect(colorAlpha({ value: 'red', amount: 0.5 })).toBe('#ff000080');
      expect(colorAlpha({ value: 'red', amount: 0.5, to: 'rgba' })).toBe(
        'rgba(255, 0, 0, 0.5)',
      );
    });

    test('colorMix', () => {
      expect(colorMix({ color1: 'white', color2: 'black' })).toBe('#808080');
      expect(colorMix({ color1: 'red', color2: 'blue' })).toBe('#800080');
      expect(colorMix({ color1: 'red', color2: 'blue', weight: 0.25 })).toBe(
        '#4000bf',
      );
    });

    test('colorGrayscale', () => {
      expect(colorGrayscale({ value: 'red' })).toBe('#808080');
      expect(colorGrayscale({ value: '#00ff00' })).toBe('#808080');
    });

    test('colorRotateHue', () => {
      expect(colorRotateHue({ value: 'red', degrees: 120 })).toBe('#00ff00');
      expect(colorRotateHue({ value: 'red', degrees: -120 })).toBe('#0000ff');
    });

    test('colorInvert', () => {
      expect(colorInvert({ value: 'white' })).toBe('#000000');
      expect(colorInvert({ value: 'black' })).toBe('#ffffff');
      expect(colorInvert({ value: 'red' })).toBe('#00ffff');
    });
  });

  describe('A11y', () => {
    test('colorIsDark', () => {
      expect(colorIsDark('black')).toBe(true);
      expect(colorIsDark('white')).toBe(false);
      expect(colorIsDark('navy')).toBe(true);
    });

    test('colorIsLight', () => {
      expect(colorIsLight('white')).toBe(true);
      expect(colorIsLight('black')).toBe(false);
      expect(colorIsLight('yellow')).toBe(true);
    });

    test('colorLuminance', () => {
      expect(colorLuminance('white')).toBe(1);
      expect(colorLuminance('black')).toBe(0);
      expect(colorLuminance('red')).toBe(0.2126);
    });

    test('colorContrast', () => {
      expect(colorContrast({ color1: 'white', color2: 'black' })).toBe(21);
      expect(colorContrast({ color1: 'white', color2: 'white' })).toBe(1);
      expect(colorContrast({ color1: 'red', color2: 'white' })).toBe(4);
    });

    test('colorIsReadable', () => {
      expect(colorIsReadable({ color1: 'black', color2: 'white' })).toBe(true);
      expect(colorIsReadable({ color1: 'gray', color2: 'white' })).toBe(false); // AA is 4.5
      expect(
        colorIsReadable({ color1: 'gray', color2: 'white', level: 'AA_Large' }),
      ).toBe(true); // AA Large is 3
    });
  });
});
