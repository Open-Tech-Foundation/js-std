import tryParseSemver from './tryParseSemver';

// A version-shaped run: up to three dot-separated groups of digits, bounded by
// a non-digit on each side so the match starts and ends at a component rather
// than inside one. Sixteen digits is the most a component can hold and still
// round-trip as a number, and a longer run is skipped rather than truncated.
const COERCE_REGEX =
  /(?:^|[^\d])(\d{1,16})(?:\.(\d{1,16}))?(?:\.(\d{1,16}))?(?:$|[^\d])/;

/**
 * Pulls a valid version out of a loosely written one.
 *
 * Versions in the wild are rarely canonical — a git tag reads `v2`, a Docker
 * image `node:20.11`, a vendored file `4.17.21.min`. Each means something
 * obvious to a reader and nothing to `semverParse`, which requires all three
 * components and throws otherwise. This fills the missing ones with zero so
 * the rest of the module can be used on them.
 *
 * The first version-shaped run wins, and anything after the third component is
 * discarded — including a pre-release or build suffix, which cannot be trusted
 * to mean what it looks like in a string this loose. Coerce first and parse
 * the result when you need the parts.
 *
 * What comes out is still held to the specification, so a component with a
 * leading zero is not silently renumbered: `'007'` yields `null` rather than
 * `'7.0.0'`, because `007` is not a SemVer component and guessing which one
 * was meant is not this function's job.
 *
 * @param {string} version The string to coerce.
 * @returns {string|null} A canonical version string, or `null` if there is no
 * version-shaped run in the input.
 *
 * @example
 * semverCoerce('v2') //=> '2.0.0'
 * semverCoerce('20.11') //=> '20.11.0'
 * semverCoerce('4.17.21.min') //=> '4.17.21'
 *
 * @example
 * semverCoerce('release-1.2.3-rc.1') //=> '1.2.3'
 * semverCoerce('not a version') //=> null
 * semverCoerce('007') //=> null
 */
export default function semverCoerce(version: string): string | null {
  if (typeof version !== 'string') {
    return null;
  }

  const match = COERCE_REGEX.exec(version);

  if (!match) {
    return null;
  }

  const [, major, minor = '0', patch = '0'] = match;
  const coerced = `${major}.${minor}.${patch}`;

  // Run it back through the parser rather than trusting the digits: that is
  // what rejects a leading zero, and keeps the two agreeing by construction.
  return tryParseSemver(coerced) === null ? null : coerced;
}
