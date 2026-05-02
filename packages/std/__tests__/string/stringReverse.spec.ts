import { stringReverse } from '../../src';

describe('String > stringReverse', () => {
  test('basic reversal', () => {
    expect(stringReverse('hello')).toBe('olleh');
    expect(stringReverse('')).toBe('');
  });

  test('combining marks', () => {
    expect(stringReverse('café')).toBe('éfac');
  });

  test('emoji sequences stay intact', () => {
    expect(stringReverse('👨‍👩‍👧‍👦')).toBe('👨‍👩‍👧‍👦');
  });

  test('mixed content', () => {
    expect(stringReverse('ab🔥cd')).toBe('dc🔥ba');
  });

  test('surrogate pairs', () => {
    expect(stringReverse('𝌆')).toBe('𝌆');
    expect(stringReverse('a𝌆b')).toBe('b𝌆a');
  });
});
