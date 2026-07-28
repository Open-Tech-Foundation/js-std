import type { OrderType } from '../array/sort';
import compareParsed from './compareParsed';
import semverParse from './semverParse';

/**
 * Sorts version strings by SemVer precedence, returning a new array.
 *
 * A plain `sort` orders versions as strings, which puts `1.10.0` before
 * `1.2.3`. This orders them numerically per segment.
 *
 * @param {string[]} versions The versions to sort.
 * @param {OrderType} [order='asc'] The sort order.
 * @returns {string[]} A new sorted array.
 * @throws {TypeError} If any string is not a valid SemVer version.
 *
 * @example
 * semverSort(['1.10.0', '1.2.3', '1.0.0'])
 * //=> ['1.0.0', '1.2.3', '1.10.0']
 *
 * @example
 * semverSort(['1.0.0', '1.0.0-rc.1', '1.0.0-alpha'], 'desc')
 * //=> ['1.0.0', '1.0.0-rc.1', '1.0.0-alpha']
 */
export default function semverSort(
  versions: string[] = [],
  order: OrderType = 'asc',
): string[] {
  // Parse once up front rather than on every comparison.
  const parsed = versions.map((version) => ({
    version,
    semver: semverParse(version),
  }));

  parsed.sort((a, b) => {
    const result = compareParsed(a.semver, b.semver);

    return order === 'asc' ? result : -result;
  });

  return parsed.map((entry) => entry.version);
}
