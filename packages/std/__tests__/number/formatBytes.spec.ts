import { formatBytes } from '../../src';

describe('Number', () => {
  test('formatBytes', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1023)).toBe('1023 B');
    expect(formatBytes(1024)).toBe('1 KiB');
    expect(formatBytes(1536)).toBe('1.5 KiB');
    expect(formatBytes(1048576)).toBe('1 MiB');
    expect(formatBytes(1234567)).toBe('1.18 MiB');
    expect(formatBytes(1234567, { decimals: 0 })).toBe('1 MiB');
    expect(formatBytes(1073741824)).toBe('1 GiB');
    expect(formatBytes(1099511627776)).toBe('1 TiB');
    expect(formatBytes(1125899906842624)).toBe('1 PiB');
    expect(formatBytes(-1024)).toBe('-1 KiB');
    expect(formatBytes(Number.NaN)).toBe('NaN');
    expect(formatBytes(Number.POSITIVE_INFINITY)).toBe('Infinity');

    // binary: false (use 1000 as base)
    expect(formatBytes(1000, { binary: false })).toBe('1 KB');
    expect(formatBytes(1000000, { binary: false })).toBe('1 MB');
    expect(formatBytes(1500000, { binary: false })).toBe('1.5 MB');
    expect(formatBytes(1000000000, { binary: false })).toBe('1 GB');
  });
});
