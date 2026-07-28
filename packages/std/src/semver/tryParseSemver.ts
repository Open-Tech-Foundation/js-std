/**
 * A parsed [Semantic Versioning 2.0.0](https://semver.org) version.
 */
export interface Semver {
  major: number;
  minor: number;
  patch: number;
  /**
   * The dot-separated pre-release identifiers, with numeric ones kept as
   * numbers so they compare numerically. Empty for a stable release.
   */
  prerelease: (string | number)[];
  /** The dot-separated build metadata identifiers. Ignored by precedence. */
  build: string[];
}

// The official regular expression from semver.org, less its anchors and the
// optional `v` prefix this module strips before matching.
const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

const NUMERIC_IDENTIFIER = /^(?:0|[1-9]\d*)$/;

/**
 * Splits a pre-release string into identifiers, keeping numeric ones as
 * numbers. `'alpha.1'` becomes `['alpha', 1]`.
 */
export function parsePrerelease(prerelease: string): (string | number)[] {
  if (prerelease === '') {
    return [];
  }

  return prerelease
    .split('.')
    .map((part) =>
      NUMERIC_IDENTIFIER.test(part) ? Number.parseInt(part, 10) : part,
    );
}

/**
 * Parses a version string, returning `null` instead of throwing.
 *
 * A leading `v` and surrounding whitespace are tolerated, because that is how
 * versions appear in git tags and changelogs.
 */
export default function tryParseSemver(version: string): Semver | null {
  if (typeof version !== 'string') {
    return null;
  }

  const trimmed = version.trim().replace(/^v/, '');
  const match = SEMVER_REGEX.exec(trimmed);

  if (!match) {
    return null;
  }

  const [, major, minor, patch, prerelease, build] = match;

  return {
    major: Number.parseInt(major, 10),
    minor: Number.parseInt(minor, 10),
    patch: Number.parseInt(patch, 10),
    prerelease: parsePrerelease(prerelease ?? ''),
    build: build === undefined ? [] : build.split('.'),
  };
}
