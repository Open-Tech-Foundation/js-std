import { inferType } from '../../lib/index.esm.js';

describe('String', () => {
  test('inferType', () => {
    expect(inferType()).toBe('unknown');
    expect(inferType('')).toBe('string');
    expect(inferType('a')).toBe('string');
    expect(inferType('abc')).toBe('string');
    expect(inferType('The quick brown fox')).toBe('string');
    expect(inferType('null')).toBe('null');
    expect(inferType('Null')).toBe('null');
    expect(inferType('NULL')).toBe('null');
    expect(inferType('true')).toBe('boolean');
    expect(inferType('True')).toBe('boolean');
    expect(inferType('TRUE')).toBe('boolean');
    expect(inferType('false')).toBe('boolean');
    expect(inferType('False')).toBe('boolean');
    expect(inferType('FALSE')).toBe('boolean');
    expect(inferType('undefined')).toBe('undefined');
    expect(inferType('Undefined')).toBe('undefined');
    expect(inferType('1')).toBe('number');
    expect(inferType('37')).toBe('number');
    expect(inferType('10.5')).toBe('number');
    expect(inferType('100.25')).toBe('number');
    expect(inferType('10_000_200')).toBe('number');
    expect(inferType('0xA')).toBe('number');
    expect(inferType('500K')).toBe('string');
  });
});
