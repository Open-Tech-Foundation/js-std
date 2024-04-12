import { hexToRGB } from '../../src';

describe('Colors > hexToRGB', () => {
  test('colors', async () => {
    expect(hexToRGB('#000000')).toEqual([0, 0, 0]);
    expect(hexToRGB('#FFFFFF')).toEqual([255, 255, 255]);
    expect(hexToRGB('#ffffff')).toEqual([255, 255, 255]);
    expect(hexToRGB('#FF0000')).toEqual([255, 0, 0]);
    expect(hexToRGB('#00FF00')).toEqual([0, 255, 0]);
    expect(hexToRGB('#0000FF')).toEqual([0, 0, 255]);
    expect(hexToRGB('#AAAAAA')).toEqual([170, 170, 170]);
    expect(hexToRGB('#DDDDDD')).toEqual([221, 221, 221]);
    expect(hexToRGB('#ff851b')).toEqual([255, 133, 27]);
  });
});
