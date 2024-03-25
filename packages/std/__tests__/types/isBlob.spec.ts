import { isBlob } from '../../src';

describe('Types > isBlob', () => {
  test('invalid cases', () => {
    expect(isBlob()).toBe(false);
    expect(isBlob({})).toBe(false);
  });

  test('valid cases', () => {
    expect(isBlob(new Blob())).toBe(true);
  });
});
