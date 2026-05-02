/**
 * Formats a number of bytes into a human-readable string.
 *
 * @param {number} bytes The number of bytes.
 * @param {object} options The options object.
 * @param {number} options.decimals The number of decimal places (default 2).
 * @param {boolean} options.binary If true, use 1024 as base (KiB); otherwise 1000 (KB) (default true).
 * @returns {string} The formatted string with appropriate unit.
 *
 * @example
 * formatBytes(0) //=> '0 B'
 * formatBytes(1023) //=> '1023 B'
 * formatBytes(1024) //=> '1 KiB'
 * formatBytes(1234567) //=> '1.18 MiB'
 * formatBytes(1234567, { decimals: 0 }) //=> '1 MiB'
 * formatBytes(1000, { binary: false }) //=> '1 KB'
 */

const BINARY_UNITS = [
  'B',
  'KiB',
  'MiB',
  'GiB',
  'TiB',
  'PiB',
  'EiB',
  'ZiB',
  'YiB',
];
const DECIMAL_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

interface FormatBytesOptions {
  decimals?: number;
  binary?: boolean;
}

export default function formatBytes(
  bytes: number,
  options: FormatBytesOptions = {},
): string {
  const { decimals = 2, binary = true } = options;

  if (!Number.isFinite(bytes)) {
    return String(bytes);
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = binary ? BINARY_UNITS : DECIMAL_UNITS;
  const k = binary ? 1024 : 1000;
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const unitIndex = Math.min(i, units.length - 1);
  const value = bytes / k ** unitIndex;

  return `${Number.parseFloat(value.toFixed(decimals))} ${units[unitIndex]}`;
}
