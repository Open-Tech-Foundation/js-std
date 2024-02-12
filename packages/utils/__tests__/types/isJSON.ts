import { isJSON } from '../../src';

describe('Types > isJSON', () => {
  test('invalid cases', () => {
    expect(isJSON()).toBeFalsy();
    expect(isJSON('')).toBeFalsy();
    expect(isJSON('undefined')).toBeFalsy();
    expect(isJSON('null')).toBeFalsy();
    expect(isJSON('true')).toBeFalsy();
    expect(isJSON('false')).toBeFalsy();
    expect(isJSON('1')).toBeFalsy();
    expect(isJSON('12345')).toBeFalsy();
    expect(isJSON('abc')).toBeFalsy();
    expect(isJSON('{a}')).toBeFalsy();
    expect(isJSON('{a:}')).toBeFalsy();
    expect(isJSON('{a:1}')).toBeFalsy();
    expect(isJSON('{"a": undefined}')).toBeFalsy();
    expect(isJSON('[]')).toBeFalsy();
  });

  test('valid cases', () => {
    expect(isJSON('{}')).toBeTruthy();
    expect(isJSON('{"a":1}')).toBeTruthy();
    expect(
      isJSON(
        '{"a": "abc", "b": true, "c": false, "d": [{"e": 1}, null, 5.0], "f": {}}'
      )
    ).toBeTruthy();
  });
});
