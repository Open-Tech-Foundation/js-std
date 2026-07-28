import semverFormat from './semverFormat';
import semverParse from './semverParse';
import type { Semver } from './tryParseSemver';

export type SemverRelease =
  | 'major'
  | 'minor'
  | 'patch'
  | 'premajor'
  | 'preminor'
  | 'prepatch'
  | 'prerelease';

const RELEASES = new Set<string>([
  'major',
  'minor',
  'patch',
  'premajor',
  'preminor',
  'prepatch',
  'prerelease',
]);

function startPrerelease(identifier?: string): (string | number)[] {
  return identifier === undefined ? [0] : [identifier, 0];
}

/**
 * Bumps the trailing numeric identifier of an existing pre-release, appending
 * one when every identifier is alphanumeric: `beta` becomes `beta.0`.
 */
function bumpPrerelease(
  prerelease: (string | number)[],
  identifier?: string,
): (string | number)[] {
  // A different identifier restarts the series, as does moving from a bare
  // alphanumeric pre-release onto a named one.
  if (identifier !== undefined) {
    if (prerelease[0] !== identifier || typeof prerelease[1] !== 'number') {
      return [identifier, 0];
    }
  }

  const next = [...prerelease];

  for (let i = next.length - 1; i >= 0; i--) {
    if (typeof next[i] === 'number') {
      next[i] = (next[i] as number) + 1;
      return next;
    }
  }

  next.push(0);

  return next;
}

/**
 * Increments a version, returning the new version string.
 *
 * The plain releases (`major`, `minor`, `patch`) resolve an in-progress
 * pre-release rather than skipping past it, so `1.0.0-rc.1` majors to `1.0.0`,
 * not `2.0.0`. Build metadata is dropped, since it does not carry over.
 *
 * @param {string} version The version to increment.
 * @param {SemverRelease} release The kind of increment to apply.
 * @param {string} [identifier] The pre-release identifier, such as `'beta'`.
 * @returns {string} The incremented version string.
 * @throws {TypeError} If the version is invalid or the release is unknown.
 *
 * @example
 * semverIncrement('1.2.3', 'minor') //=> '1.3.0'
 * semverIncrement('1.0.0-rc.1', 'major') //=> '1.0.0'
 *
 * @example
 * semverIncrement('1.2.3', 'preminor', 'beta') //=> '1.3.0-beta.0'
 * semverIncrement('1.3.0-beta.0', 'prerelease') //=> '1.3.0-beta.1'
 */
export default function semverIncrement(
  version: string,
  release: SemverRelease,
  identifier?: string,
): string {
  if (!RELEASES.has(release)) {
    throw new TypeError(`Invalid SemVer release: ${String(release)}`);
  }

  const { major, minor, patch, prerelease } = semverParse(version);
  const hasPrerelease = prerelease.length > 0;

  const next: Semver = { major, minor, patch, prerelease: [], build: [] };

  switch (release) {
    case 'major':
      // An in-progress pre-release of x.0.0 already *is* the next major.
      if (!hasPrerelease || minor !== 0 || patch !== 0) {
        next.major = major + 1;
      }
      next.minor = 0;
      next.patch = 0;
      break;

    case 'minor':
      if (!hasPrerelease || patch !== 0) {
        next.minor = minor + 1;
      }
      next.patch = 0;
      break;

    case 'patch':
      if (!hasPrerelease) {
        next.patch = patch + 1;
      }
      break;

    case 'premajor':
      next.major = major + 1;
      next.minor = 0;
      next.patch = 0;
      next.prerelease = startPrerelease(identifier);
      break;

    case 'preminor':
      next.minor = minor + 1;
      next.patch = 0;
      next.prerelease = startPrerelease(identifier);
      break;

    case 'prepatch':
      next.patch = patch + 1;
      next.prerelease = startPrerelease(identifier);
      break;

    case 'prerelease':
      if (!hasPrerelease) {
        next.patch = patch + 1;
        next.prerelease = startPrerelease(identifier);
      } else {
        next.prerelease = bumpPrerelease(prerelease, identifier);
      }
      break;
  }

  return semverFormat(next);
}
