import { isDataView } from '../../src';

describe('Types > isDataView', () => {
  test('invalid cases', () => {
    expect(isDataView()).toBe(false);
    expect(isDataView(null)).toBe(false);
    expect(isDataView([])).toBe(false);
    expect(isDataView({})).toBe(false);
    expect(isDataView(new Uint8Array())).toBe(false);
    expect(isDataView(new ArrayBuffer(8))).toBe(false);
  });

  test('valid cases', () => {
    const buffer = new ArrayBuffer(8);
    expect(isDataView(new DataView(buffer))).toBe(true);
  });
});
