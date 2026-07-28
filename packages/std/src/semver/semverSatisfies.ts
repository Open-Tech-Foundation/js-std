import compareParsed from './compareParsed';
import parseRange from './parseRange';
import type { Comparator } from './parseRange';
import semverParse from './semverParse';
import type { Semver } from './tryParseSemver';

function test(version: Semver, { op, semver }: Comparator): boolean {
  if (op === '*') {
    return true;
  }

  const result = compareParsed(version, semver);

  switch (op) {
    case '=':
      return result === 0;
    case '>':
      return result > 0;
    case '>=':
      return result >= 0;
    case '<':
      return result < 0;
    default:
      return result <= 0;
  }
}

/**
 * A pre-release is only offered to a range that already asked for one on the
 * same `major.minor.patch`. Without this, `^1.2.3` would quietly pick up
 * `2.0.0-alpha.1`, which is unreleased and by definition unstable.
 */
function opensToPrerelease(version: Semver, set: Comparator[]): boolean {
  return set.some(
    ({ op, semver }) =>
      op !== '*' &&
      semver.prerelease.length > 0 &&
      semver.major === version.major &&
      semver.minor === version.minor &&
      semver.patch === version.patch,
  );
}

/**
 * Checks whether a version satisfies a range.
 *
 * Supports the full npm range grammar: comparators (`>`, `>=`, `<`, `<=`, `=`),
 * caret (`^1.2.3`) and tilde (`~1.2.3`) ranges, wildcards (`1.x`, `1.2.*`,
 * `*`), hyphen ranges (`1.2.3 - 2.3.4`), whitespace-joined sets that must all
 * hold, and `||` between alternatives.
 *
 * A pre-release version only satisfies a range when some comparator in the
 * matching set names a pre-release on the same `major.minor.patch` — so
 * `2.0.0-alpha` does not satisfy `>=1.0.0`. Pass `{ includePrerelease: true }`
 * to compare on version precedence alone.
 *
 * @param {string} version The version to test.
 * @param {string} range The range to test against.
 * @param {{ includePrerelease?: boolean }} [options] Set `includePrerelease` to match pre-releases anywhere.
 * @returns {boolean} `true` if the version satisfies the range.
 * @throws {TypeError} If the version or the range cannot be parsed.
 *
 * @example
 * semverSatisfies('1.2.5', '^1.2.3') //=> true
 * semverSatisfies('2.0.0', '^1.2.3') //=> false
 * semverSatisfies('1.2.7', '~1.2.3') //=> true
 *
 * @example
 * semverSatisfies('1.5.0', '>=1.2.3 <2.0.0 || 3.x') //=> true
 * semverSatisfies('1.2.3', '1.2.3 - 2.3.4') //=> true
 *
 * @example
 * semverSatisfies('2.0.0-alpha', '>=1.0.0') //=> false
 * semverSatisfies('2.0.0-alpha', '>=1.0.0', { includePrerelease: true }) //=> true
 */
export default function semverSatisfies(
  version: string,
  range: string,
  options: { includePrerelease?: boolean } = {},
): boolean {
  const { includePrerelease = false } = options;
  const parsed = semverParse(version);
  const sets = parseRange(range, includePrerelease);
  const isPrerelease = parsed.prerelease.length > 0;

  return sets.some((set) => {
    if (!set.every((c) => test(parsed, c))) {
      return false;
    }

    if (isPrerelease && !includePrerelease) {
      return opensToPrerelease(parsed, set);
    }

    return true;
  });
}
