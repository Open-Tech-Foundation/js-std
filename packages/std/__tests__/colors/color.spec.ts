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

import { ColorFormat, color } from '../../src';

describe('Colors > color', () => {
  describe('Input parsing (Standard)', () => {
    test('Hex strings', () => {
      expect(color({ value: '#ff0000', to: 'rgba-object' })).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      });
      expect(color({ value: '#f00', to: 'rgba-object' })).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      });
      expect(color({ value: '#ff000080', to: 'rgba-object' })).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 0.5,
      });
    });

    test('Color names', () => {
      expect(color({ value: 'red', to: 'rgba-object' })).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      });
      expect(color({ value: 'AliceBlue', to: 'hex' })).toBe('#f0f8ff');
      expect(color({ value: 'palegreen', to: 'hex' })).toBe('#98fb98');
      expect(color({ value: 'rebeccapurple', to: 'hex' })).toBe('#663399');
    });

    test('RGB strings', () => {
      expect(color({ value: 'rgb(255, 0, 0)', to: 'rgba-object' })).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      });
      expect(
        color({ value: 'rgba(255, 0, 0, 0.5)', to: 'rgba-object' }),
      ).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 0.5,
      });
    });

    test('HSL strings', () => {
      expect(color({ value: 'hsl(0, 100%, 50%)', to: 'rgba-object' })).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      });
      expect(
        color({ value: 'hsla(0, 100%, 50%, 0.5)', to: 'rgba-object' }),
      ).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 0.5,
      });
    });

    test('OKLCH strings', () => {
      expect(color({ value: 'oklch(0.628 0.258 29.23)', to: 'hex' })).toBe(
        '#ff0000',
      );
      expect(
        color({ value: 'oklch(0.628 0.258 29.23 / 0.5)', to: 'rgba' }),
      ).toBe('rgba(255, 0, 0, 0.5)');
    });
  });

  describe('Edge Cases & Robustness', () => {
    test('Weird spacing', () => {
      expect(color({ value: '  #ff0000  ', to: 'hex' })).toBe('#ff0000');
      expect(color({ value: ' rgb( 255 , 0 , 0 ) ', to: 'rgb' })).toBe(
        'rgb(255, 0, 0)',
      );
      expect(color({ value: 'hsla( 0 , 100% , 50% , 0.5 )', to: 'hsla' })).toBe(
        'hsla(0, 100%, 50%, 0.5)',
      );
    });

    test('Mixed case', () => {
      expect(color({ value: 'rGb(255,0,0)', to: 'hex' })).toBe('#ff0000');
      expect(color({ value: 'HSLA(0,100%,50%,1)', to: 'hex' })).toBe('#ff0000');
    });

    test('Out of range values (Clamping)', () => {
      // RGB > 255
      expect(color({ value: 'rgb(300, 0, 0)', to: 'rgba-object' })).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      });
      // Alpha > 1
      expect(color({ value: 'rgba(0,0,0,2)', to: 'rgba-object' })).toEqual({
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      });
      // HSL > limits (Note: white results in h:0, s:0, l:100)
      expect(
        color({ value: 'hsl(400, 150%, 150%)', to: 'hsla-object' }),
      ).toEqual({
        h: 0,
        s: 0,
        l: 100,
        a: 1,
      });
      // Objects/Arrays out of range
      expect(
        color({ value: { r: 500, g: -10, b: 0 }, to: 'rgba-object' }),
      ).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      });
      expect(color({ value: [0, 0, 0, 5], to: 'rgba-object' })).toEqual({
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      });
      expect(
        color({ value: { l: 0.5, c: 0.1, h: 30, a: 2 }, to: 'rgba-object' }),
      ).toEqual({
        r: 148,
        g: 75,
        b: 64,
        a: 1,
      });
    });
  });

  describe('Error Handling', () => {
    test('Throws on invalid color strings', () => {
      expect(() => color({ value: 'invalid', to: 'hex' })).toThrow(
        'Invalid Color',
      );
      expect(() => color({ value: '#zzzzzz', to: 'hex' })).toThrow(
        'Invalid Color',
      );
      expect(() => color({ value: 'rgb(a,b,c)', to: 'hex' })).toThrow(
        'Invalid Color',
      );
      expect(() => color({ value: null as any, to: 'hex' })).toThrow(
        'Invalid Color',
      );
    });

    test('Throws on invalid objects', () => {
      expect(() => color({ value: {}, to: 'hex' })).toThrow('Invalid Color');
      expect(() => color({ value: { x: 1 }, to: 'hex' })).toThrow(
        'Invalid Color',
      );
    });

    test('Throws on invalid format', () => {
      expect(() => color({ value: 'red', to: 'invalid-format' })).toThrow(
        'Invalid format',
      );
    });
  });

  describe('Output formats', () => {
    const red = { r: 255, g: 0, b: 0, a: 1 };

    test('hex', () => {
      expect(color({ value: red, to: ColorFormat.HEX })).toBe('#ff0000');
      expect(color({ value: { ...red, a: 0.5 }, to: 'hex' })).toBe('#ff000080');
    });

    test('rgb/rgba', () => {
      expect(color({ value: red, to: 'rgb' })).toBe('rgb(255, 0, 0)');
      expect(color({ value: { ...red, a: 0.5 }, to: 'rgba' })).toBe(
        'rgba(255, 0, 0, 0.5)',
      );
    });

    test('hsl/hsla', () => {
      expect(color({ value: red, to: 'hsl' })).toBe('hsl(0, 100%, 50%)');
      expect(color({ value: { ...red, a: 0.5 }, to: 'hsla' })).toBe(
        'hsla(0, 100%, 50%, 0.5)',
      );
    });

    test('rgba-object/array', () => {
      expect(color({ value: red, to: 'rgba-object' })).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      });
      expect(color({ value: red, to: 'rgba-array' })).toEqual([255, 0, 0, 1]);
    });

    test('hsla-object/array', () => {
      expect(color({ value: red, to: 'hsla-object' })).toEqual({
        h: 0,
        s: 100,
        l: 50,
        a: 1,
      });
      expect(color({ value: red, to: 'hsla-array' })).toEqual([0, 100, 50, 1]);
    });

    test('css (smart format)', () => {
      expect(color({ value: red, to: 'css' })).toBe('red');
      expect(color({ value: '#f0f8ff', to: 'css' })).toBe('aliceblue');
      expect(color({ value: '#98fb98', to: 'css' })).toBe('palegreen');
      expect(color({ value: { ...red, a: 0.5 }, to: 'css' })).toBe(
        'rgba(255, 0, 0, 0.5)',
      );
      expect(color({ value: '#123456', to: 'css' })).toBe('#123456');
    });

    test('oklch', () => {
      expect(color({ value: red, to: 'oklch' })).toBe(
        'oklch(0.628 0.2577 29.23)',
      );
      expect(color({ value: { ...red, a: 0.5 }, to: 'oklch' })).toBe(
        'oklch(0.628 0.2577 29.23 / 0.5)',
      );
      expect(color({ value: red, to: 'oklch-object' })).toEqual({
        l: 0.628,
        c: 0.2577,
        h: 29.23,
        a: 1,
      });
    });

    test('ansi', () => {
      expect(color({ value: 'red', to: 'ansi' })).toBe('\x1b[38;2;255;0;0m');
      expect(color({ value: '#00ff00', to: 'ansi' })).toBe(
        '\x1b[38;2;0;255;0m',
      );
    });
  });
});
