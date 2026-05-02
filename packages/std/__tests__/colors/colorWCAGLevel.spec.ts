import { colorWCAGLevel } from '../../src';

describe('Colors', () => {
  test('colorWCAGLevel', () => {
    expect(colorWCAGLevel('#000', '#fff')).toBe('AAA');
    expect(colorWCAGLevel('#000', '#000')).toBe('FAIL');
    expect(colorWCAGLevel('#000', '#767676')).toBe('AA');
    expect(colorWCAGLevel('#000', '#595959')).toBe('A');
    expect(colorWCAGLevel('rgb(0,0,0)', 'rgb(255,255,255)')).toBe('AAA');
    expect(colorWCAGLevel('#000', '#ccc')).toBe('AAA');
  });
});
