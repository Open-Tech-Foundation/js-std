import { formatCompact } from '../../src';

describe('Number', () => {
  test('formatCompact', () => {
    expect(formatCompact(1200)).toMatch(/1\.2K/);
    expect(formatCompact(1200000)).toMatch(/1\.2M/);
    expect(formatCompact(1200000000)).toMatch(/1\.2B/);
    expect(formatCompact(1200, { display: 'long' })).toMatch(/1\.2 thousand/);
    expect(formatCompact(1200000, { display: 'long' })).toMatch(/1\.2 million/);
    expect(formatCompact(1234, { fractionDigits: 2 })).toBe('1.23K');
  });
});
