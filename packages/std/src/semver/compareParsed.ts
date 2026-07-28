import type { Semver } from './tryParseSemver';

function compareNumbers(a: number, b: number): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Compares pre-release identifier lists per the SemVer precedence rules:
 * numeric identifiers compare numerically, alphanumeric ones compare by ASCII
 * order, numeric always sorts below alphanumeric, and when every shared
 * identifier is equal the longer list wins.
 */
function comparePrerelease(
  a: (string | number)[],
  b: (string | number)[],
): number {
  // A version carrying a pre-release ranks below the same version without one.
  if (a.length === 0 && b.length === 0) return 0;
  if (a.length === 0) return 1;
  if (b.length === 0) return -1;

  const length = Math.min(a.length, b.length);

  for (let i = 0; i < length; i++) {
    const x = a[i];
    const y = b[i];

    if (x === y) continue;

    const xIsNumber = typeof x === 'number';
    const yIsNumber = typeof y === 'number';

    if (xIsNumber && yIsNumber) return compareNumbers(x, y);
    if (xIsNumber) return -1;
    if (yIsNumber) return 1;

    return x < y ? -1 : 1;
  }

  return compareNumbers(a.length, b.length);
}

/**
 * Compares two parsed versions by SemVer precedence. Build metadata is ignored,
 * as the specification requires.
 */
export default function compareParsed(a: Semver, b: Semver): -1 | 0 | 1 {
  const result =
    compareNumbers(a.major, b.major) ||
    compareNumbers(a.minor, b.minor) ||
    compareNumbers(a.patch, b.patch) ||
    comparePrerelease(a.prerelease, b.prerelease);

  return result < 0 ? -1 : result > 0 ? 1 : 0;
}
