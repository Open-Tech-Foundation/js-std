import compareParsed from './compareParsed';
import type { SemverRelease } from './semverIncrement';
import semverParse from './semverParse';

/**
 * Reports which kind of release separates two versions.
 *
 * This is the inverse question to `semverIncrement`: given where you were and
 * where you are, what sort of bump was that? Answering it from the strings by
 * hand is where the pre-release rules bite, so it is easy to get wrong.
 *
 * Order does not matter — the two are compared by precedence and the answer
 * describes the distance, not the direction. Build metadata is ignored, as it
 * is everywhere else, so `1.0.0+a` and `1.0.0+b` differ by nothing.
 *
 * Moving off a pre-release onto its release reports the release that landed
 * rather than `'prerelease'`: `1.0.0-rc.1` to `1.0.0` is a `'major'`, because
 * reaching `1.0.0` is what the pre-releases were leading to.
 *
 * @param {string} a The first version.
 * @param {string} b The second version.
 * @returns {SemverRelease|null} The release kind, or `null` if they are equal.
 * @throws {TypeError} If either string is not a valid SemVer version.
 *
 * @example
 * semverDiff('1.2.3', '2.0.0') //=> 'major'
 * semverDiff('1.2.3', '1.3.0') //=> 'minor'
 * semverDiff('1.2.3', '1.2.4') //=> 'patch'
 * semverDiff('1.2.3', '1.2.3') //=> null
 *
 * @example
 * semverDiff('1.2.3', '2.0.0-rc.1') //=> 'premajor'
 * semverDiff('1.3.0-beta.0', '1.3.0-beta.1') //=> 'prerelease'
 * semverDiff('1.0.0-rc.1', '1.0.0') //=> 'major'
 */
export default function semverDiff(a: string, b: string): SemverRelease | null {
  const parsedA = semverParse(a);
  const parsedB = semverParse(b);
  const comparison = compareParsed(parsedA, parsedB);

  if (comparison === 0) {
    return null;
  }

  const high = comparison > 0 ? parsedA : parsedB;
  const low = comparison > 0 ? parsedB : parsedA;
  const highHasPre = high.prerelease.length > 0;
  const lowHasPre = low.prerelease.length > 0;

  // A pre-release resolving into a plain release needs two special cases;
  // anything else falls through to the ordinary comparison below.
  if (lowHasPre && !highHasPre) {
    // A pre-release of an x.0.0 was only ever leading to that major, whatever
    // the release turns out to be: 1.0.0-1 to 1.1.1 is still the 1.0.0 major
    // arriving.
    if (low.minor === 0 && low.patch === 0) {
      return 'major';
    }

    // The same core on both sides means the pre-release simply resolved, and
    // the bump is named for the deepest non-zero component it was staging.
    if (
      low.major === high.major &&
      low.minor === high.minor &&
      low.patch === high.patch
    ) {
      return low.minor !== 0 && low.patch === 0 ? 'minor' : 'patch';
    }
  }

  const prefix = highHasPre ? 'pre' : '';

  if (parsedA.major !== parsedB.major) {
    return `${prefix}major` as SemverRelease;
  }
  if (parsedA.minor !== parsedB.minor) {
    return `${prefix}minor` as SemverRelease;
  }
  if (parsedA.patch !== parsedB.patch) {
    return `${prefix}patch` as SemverRelease;
  }

  // Same core on both sides, so only the pre-release identifiers differ.
  return 'prerelease';
}
