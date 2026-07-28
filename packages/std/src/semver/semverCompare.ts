import compareParsed from './compareParsed';
import semverParse from './semverParse';

/**
 * Compares two versions by SemVer precedence, for use as an `Array#sort`
 * comparator.
 *
 * Build metadata is ignored, as the specification requires, so `1.0.0+a` and
 * `1.0.0+b` compare equal. A pre-release ranks below the release it precedes.
 *
 * @param {string} a The first version.
 * @param {string} b The second version.
 * @returns {-1 | 0 | 1} `-1` if `a` is lower, `1` if `a` is higher, `0` if equal.
 * @throws {TypeError} If either string is not a valid SemVer version.
 *
 * @example
 * semverCompare('1.2.3', '1.10.0') //=> -1
 * semverCompare('2.0.0', '2.0.0-rc.1') //=> 1
 * semverCompare('1.0.0+a', '1.0.0+b') //=> 0
 *
 * @example
 * ['1.10.0', '1.2.3'].sort(semverCompare) //=> ['1.2.3', '1.10.0']
 */
export default function semverCompare(a: string, b: string): -1 | 0 | 1 {
  return compareParsed(semverParse(a), semverParse(b));
}
