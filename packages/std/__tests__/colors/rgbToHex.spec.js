import { rgbToHex } from '../../src';

describe('Colors > rgbToHex', () => {
  test('colors', async () => {
    expect(rgbToHex([0, 0, 0])).toEqual('#000000');
    expect(rgbToHex([1, 1, 1])).toEqual('#010101');
    expect(rgbToHex([255, 255, 255])).toEqual('#FFFFFF'.toLowerCase());
    expect(rgbToHex([255, 255, 255])).toEqual('#ffffff'.toLowerCase());
    expect(rgbToHex([255, 0, 0])).toEqual('#FF0000'.toLowerCase());
    expect(rgbToHex([0, 255, 0])).toEqual('#00FF00'.toLowerCase());
    expect(rgbToHex([0, 0, 255])).toEqual('#0000FF'.toLowerCase());
    expect(rgbToHex([170, 170, 170])).toEqual('#AAAAAA'.toLowerCase());
    expect(rgbToHex([221, 221, 221])).toEqual('#DDDDDD'.toLowerCase());
    expect(rgbToHex([255, 133, 27])).toEqual('#ff851b'.toLowerCase());
  });
});
