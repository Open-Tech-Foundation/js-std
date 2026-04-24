import { isGeneratorFunction } from '../../src';

describe('Types > isGeneratorFunction', () => {
  test('invalid cases', () => {
    expect(isGeneratorFunction()).toBe(false);
    expect(isGeneratorFunction({})).toBe(false);
    expect(isGeneratorFunction(() => {})).toBe(false);
    expect(isGeneratorFunction(() => {})).toBe(false);
    expect(isGeneratorFunction(async () => {})).toBe(false);
  });

  test('valid cases', () => {
    expect(isGeneratorFunction(function* () {})).toBe(true);
    expect(isGeneratorFunction(async function* () {})).toBe(true);
  });
});
