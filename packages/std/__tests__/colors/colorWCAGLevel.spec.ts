import { colorWCAGLevel } from '../../src';

describe('Colors', () => {
  test('colorWCAGLevel', () => {
    expect(colorWCAGLevel({ color1: '#000', color2: '#fff' })).toBe('AAA');
    expect(colorWCAGLevel({ color1: '#000', color2: '#000' })).toBe('FAIL');
    expect(colorWCAGLevel({ color1: '#000', color2: '#767676' })).toBe('AA');
    expect(colorWCAGLevel({ color1: '#000', color2: '#595959' })).toBe('A');
    expect(
      colorWCAGLevel({ color1: 'rgb(0,0,0)', color2: 'rgb(255,255,255)' }),
    ).toBe('AAA');
    expect(colorWCAGLevel({ color1: '#000', color2: '#ccc' })).toBe('AAA');
  });
});
