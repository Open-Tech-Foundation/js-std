import {
  semverCoerce,
  semverDiff,
  semverIncrement,
  semverMaxSatisfying,
  semverMinSatisfying,
} from '../../src';

describe('semverDiff', () => {
  test('names the differing core component', () => {
    expect(semverDiff('1.2.3', '2.0.0')).toBe('major');
    expect(semverDiff('1.2.3', '1.3.0')).toBe('minor');
    expect(semverDiff('1.2.3', '1.2.4')).toBe('patch');
  });

  test('returns null for versions of equal precedence', () => {
    expect(semverDiff('1.2.3', '1.2.3')).toBeNull();
    // Build metadata is ignored, as everywhere else in the module.
    expect(semverDiff('1.2.3+a', '1.2.3+b')).toBeNull();
    expect(semverDiff('v1.2.3', '1.2.3')).toBeNull();
  });

  test('is symmetric — it reports distance, not direction', () => {
    const pairs: [string, string][] = [
      ['1.2.3', '2.0.0'],
      ['1.2.3', '1.3.0'],
      ['1.0.0-rc.1', '1.0.0'],
      ['1.3.0-beta.0', '1.3.0-beta.1'],
      ['0.1.0-rc.1', '1.0.1'],
    ];

    for (const [a, b] of pairs) {
      expect(semverDiff(a, b)).toBe(semverDiff(b, a));
    }
  });

  test('prefixes with pre when the higher version is a pre-release', () => {
    expect(semverDiff('1.2.3', '2.0.0-rc.1')).toBe('premajor');
    expect(semverDiff('1.2.3', '1.3.0-rc.1')).toBe('preminor');
    expect(semverDiff('1.2.3', '1.2.4-rc.0')).toBe('prepatch');
  });

  test('reports prerelease when only the identifiers differ', () => {
    expect(semverDiff('1.3.0-beta.0', '1.3.0-beta.1')).toBe('prerelease');
    expect(semverDiff('1.0.0-alpha', '1.0.0-rc.1')).toBe('prerelease');
  });

  test('names the release that landed when a pre-release resolves', () => {
    // A pre-release of an x.0.0 was only ever leading to that major.
    expect(semverDiff('1.0.0-rc.1', '1.0.0')).toBe('major');
    expect(semverDiff('1.0.0-rc.1', '1.1.1')).toBe('major');
    expect(semverDiff('1.0.0-rc.1', '2.0.0')).toBe('major');

    // Same core on both sides: the pre-release simply resolved.
    expect(semverDiff('1.2.0-rc.1', '1.2.0')).toBe('minor');
    expect(semverDiff('1.2.3-rc.1', '1.2.3')).toBe('patch');
    expect(semverDiff('0.1.0-rc.1', '0.1.0')).toBe('minor');

    // Different cores, so the ordinary comparison decides.
    expect(semverDiff('0.1.0-rc.1', '1.0.1')).toBe('major');
    expect(semverDiff('1.2.3-rc.1', '1.3.0')).toBe('minor');
  });

  test('agrees with semverIncrement on what it undoes', () => {
    const cases: [string, 'major' | 'minor' | 'patch'][] = [
      ['1.2.3', 'major'],
      ['1.2.3', 'minor'],
      ['1.2.3', 'patch'],
      ['0.4.5', 'minor'],
    ];

    for (const [from, release] of cases) {
      expect(semverDiff(from, semverIncrement(from, release))).toBe(release);
    }
  });

  test('throws on an unparseable version', () => {
    expect(() => semverDiff('nope', '1.2.3')).toThrow(TypeError);
    expect(() => semverDiff('1.2.3', '1.2')).toThrow(TypeError);
  });
});

describe('semverCoerce', () => {
  test('fills the missing components with zero', () => {
    expect(semverCoerce('v2')).toBe('2.0.0');
    expect(semverCoerce('2')).toBe('2.0.0');
    expect(semverCoerce('20.11')).toBe('20.11.0');
    expect(semverCoerce('1.2.3')).toBe('1.2.3');
  });

  test('takes the first version-shaped run and drops the rest', () => {
    expect(semverCoerce('4.17.21.min')).toBe('4.17.21');
    expect(semverCoerce('1.2.3.4')).toBe('1.2.3');
    expect(semverCoerce('release-1.2.3-rc.1')).toBe('1.2.3');
    expect(semverCoerce('node:20.11.1')).toBe('20.11.1');
    expect(semverCoerce('=1.2.3')).toBe('1.2.3');
    expect(semverCoerce('~1.2')).toBe('1.2.0');
  });

  test('returns null when there is nothing version-shaped', () => {
    expect(semverCoerce('not a version')).toBeNull();
    expect(semverCoerce('')).toBeNull();
    expect(semverCoerce('..')).toBeNull();
    // @ts-expect-error deliberately not a string
    expect(semverCoerce(null)).toBeNull();
    // @ts-expect-error deliberately not a string
    expect(semverCoerce(undefined)).toBeNull();
  });

  test('rejects a component the specification would not accept', () => {
    // Renumbering it would be a guess, so the result is held to the spec.
    expect(semverCoerce('007')).toBeNull();
  });

  test('skips a run too long to hold as a number', () => {
    expect(semverCoerce('99999999999999999999.1.1')).toBe('1.1.0');
  });

  test('feeds the rest of the module', () => {
    expect(semverDiff(semverCoerce('v1') as string, '2.0.0')).toBe('major');
  });
});

describe('semverMaxSatisfying / semverMinSatisfying', () => {
  const versions = ['1.0.0', '1.2.3', '1.10.0', '2.0.0'];

  test('picks the extremes of the matching versions', () => {
    expect(semverMaxSatisfying(versions, '^1.0.0')).toBe('1.10.0');
    expect(semverMinSatisfying(versions, '^1.0.0')).toBe('1.0.0');
    expect(semverMaxSatisfying(versions, '~1.2.0')).toBe('1.2.3');
    expect(semverMinSatisfying(versions, '>=1.2.0')).toBe('1.2.3');
  });

  test('orders by precedence, not as strings', () => {
    // The string maximum here is '1.2.3'.
    expect(semverMaxSatisfying(['1.2.3', '1.10.0'], '*')).toBe('1.10.0');
  });

  test('returns null when nothing matches', () => {
    expect(semverMaxSatisfying(versions, '^3.0.0')).toBeNull();
    expect(semverMinSatisfying(versions, '^3.0.0')).toBeNull();
  });

  test('returns null for an empty list, and defaults to one', () => {
    expect(semverMaxSatisfying([], '*')).toBeNull();
    expect(semverMinSatisfying([], '*')).toBeNull();
    expect(semverMaxSatisfying(undefined, '*')).toBeNull();
  });

  test('excludes pre-releases unless asked for', () => {
    const withPre = ['1.0.0', '1.1.0-rc.1'];

    expect(semverMaxSatisfying(withPre, '^1.0.0')).toBe('1.0.0');
    expect(
      semverMaxSatisfying(withPre, '^1.0.0', { includePrerelease: true }),
    ).toBe('1.1.0-rc.1');
  });

  test('returns the version as written, not re-formatted', () => {
    expect(semverMaxSatisfying(['v1.2.3'], '^1.0.0')).toBe('v1.2.3');
  });

  test('throws on an unparseable entry or range', () => {
    expect(() => semverMaxSatisfying(['nope'], '*')).toThrow(TypeError);
    expect(() => semverMinSatisfying(['1.0.0'], 'nope')).toThrow(TypeError);
  });
});
