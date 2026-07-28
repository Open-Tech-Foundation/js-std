import type { Semver } from './tryParseSemver';

/**
 * Formats a parsed version back into a
 * [Semantic Versioning 2.0.0](https://semver.org) string.
 *
 * The inverse of `semverParse`, less the tolerated `v` prefix — the output is
 * always canonical.
 *
 * @param {Semver} version The parsed version.
 * @returns {string} The version string.
 *
 * @example
 * semverFormat({ major: 1, minor: 2, patch: 3, prerelease: [], build: [] })
 * //=> '1.2.3'
 *
 * @example
 * semverFormat(semverParse('v2.0.0-alpha.1+build.5')) //=> '2.0.0-alpha.1+build.5'
 */
export default function semverFormat(version: Semver): string {
  const { major, minor, patch, prerelease, build } = version;

  let out = `${major}.${minor}.${patch}`;

  if (prerelease.length > 0) {
    out += `-${prerelease.join('.')}`;
  }

  if (build.length > 0) {
    out += `+${build.join('.')}`;
  }

  return out;
}
