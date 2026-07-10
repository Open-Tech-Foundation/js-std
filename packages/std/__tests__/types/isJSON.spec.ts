import { isJSON } from '../../src';

describe('Types > isJSON', () => {
  test('invalid cases', () => {
    expect(isJSON()).toBeFalsy();
    expect(isJSON(null)).toBeFalsy();
    expect(isJSON(false)).toBeFalsy();
    expect(isJSON(1)).toBeFalsy();
    expect(isJSON({})).toBeFalsy();
    expect(isJSON([])).toBeFalsy();
    expect(isJSON('')).toBeFalsy();
    expect(isJSON('undefined')).toBeFalsy();
    expect(isJSON('abc')).toBeFalsy();
    expect(isJSON('{a}')).toBeFalsy();
    expect(isJSON('{a:}')).toBeFalsy();
    expect(isJSON('{a:1}')).toBeFalsy();
    expect(isJSON('{"a": undefined}')).toBeFalsy();
  });

  test('valid cases', () => {
    expect(isJSON('null')).toBeTruthy();
    expect(isJSON('true')).toBeTruthy();
    expect(isJSON('false')).toBeTruthy();
    expect(isJSON('1')).toBeTruthy();
    expect(isJSON('12345')).toBeTruthy();
    expect(isJSON('[]')).toBeTruthy();
    expect(isJSON('"hello"')).toBeTruthy();
    expect(isJSON('{}')).toBeTruthy();
    expect(isJSON('{"a":1}')).toBeTruthy();
    expect(
      isJSON(
        '{"a": "abc", "b": true, "c": false, "d": [{"e": 1}, null, 5.0], "f": {}}',
      ),
    ).toBeTruthy();
  });
});
