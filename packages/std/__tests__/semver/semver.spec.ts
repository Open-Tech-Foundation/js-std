import {
  semverCompare,
  semverFormat,
  semverIncrement,
  semverIsValid,
  semverParse,
  semverSatisfies,
  semverSort,
} from '../../src';

describe('semverParse', () => {
  test('parses a plain version', () => {
    expect(semverParse('1.2.3')).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: [],
      build: [],
    });
  });

  test('parses pre-release and build metadata', () => {
    expect(semverParse('2.0.0-alpha.1+build.5')).toEqual({
      major: 2,
      minor: 0,
      patch: 0,
      prerelease: ['alpha', 1],
      build: ['build', '5'],
    });
  });

  test('keeps numeric pre-release identifiers as numbers', () => {
    expect(semverParse('1.0.0-1.alpha.10').prerelease).toEqual([
      1,
      'alpha',
      10,
    ]);
  });

  test('tolerates a leading v and surrounding whitespace', () => {
    expect(semverParse('v1.2.3').major).toBe(1);
    expect(semverParse('  1.2.3  ').patch).toBe(3);
    expect(semverParse(' v0.0.1 ')).toEqual({
      major: 0,
      minor: 0,
      patch: 1,
      prerelease: [],
      build: [],
    });
  });

  test('handles large segment numbers', () => {
    expect(semverParse('10.20.30').minor).toBe(20);
    expect(semverParse('2024.1.0').major).toBe(2024);
  });

  test('throws on an invalid version', () => {
    for (const invalid of ['1.2', '1', '', 'a.b.c', '1.2.3.4', '^1.2.3']) {
      expect(() => semverParse(invalid)).toThrow(TypeError);
    }
  });

  test('rejects leading zeroes, as the spec requires', () => {
    expect(() => semverParse('01.2.3')).toThrow(TypeError);
    expect(() => semverParse('1.02.3')).toThrow(TypeError);
    expect(() => semverParse('1.2.03')).toThrow(TypeError);
    expect(() => semverParse('1.2.3-01')).toThrow(TypeError);
  });

  test('rejects empty or malformed pre-release and build sections', () => {
    expect(() => semverParse('1.2.3-')).toThrow(TypeError);
    expect(() => semverParse('1.2.3+')).toThrow(TypeError);
    expect(() => semverParse('1.2.3-alpha..1')).toThrow(TypeError);
  });

  test('names the offending value in the error', () => {
    expect(() => semverParse('nope')).toThrow('Invalid SemVer version: nope');
  });
});

describe('semverIsValid', () => {
  test('accepts valid versions', () => {
    for (const valid of [
      '0.0.0',
      '1.2.3',
      'v1.2.3',
      '1.2.3-beta.1',
      '1.2.3+build',
      '1.2.3-rc.1+build.5',
      '1.2.3-0a',
    ]) {
      expect(semverIsValid(valid)).toBe(true);
    }
  });

  test('rejects partial versions and ranges', () => {
    for (const invalid of [
      '1.2',
      '1',
      '',
      'x',
      '^1.2.3',
      '~1.2.3',
      '>=1.2.3',
      '1.x',
      '01.2.3',
      '-1.2.3',
      'a.b.c',
    ]) {
      expect(semverIsValid(invalid)).toBe(false);
    }
  });

  test('does not throw on non-string input', () => {
    expect(semverIsValid(null as never)).toBe(false);
    expect(semverIsValid(undefined as never)).toBe(false);
    expect(semverIsValid(123 as never)).toBe(false);
  });
});

describe('semverFormat', () => {
  test('formats a version', () => {
    expect(
      semverFormat({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: [],
        build: [],
      }),
    ).toBe('1.2.3');
  });

  test('formats pre-release and build metadata', () => {
    expect(
      semverFormat({
        major: 2,
        minor: 0,
        patch: 0,
        prerelease: ['alpha', 1],
        build: ['build', '5'],
      }),
    ).toBe('2.0.0-alpha.1+build.5');
  });

  test('round-trips through semverParse, dropping the v prefix', () => {
    for (const version of [
      '0.0.0',
      '1.2.3',
      '1.2.3-alpha',
      '1.2.3-alpha.1',
      '1.2.3+build.5',
      '1.2.3-rc.1+build.5',
      '10.20.30',
    ]) {
      expect(semverFormat(semverParse(version))).toBe(version);
    }

    expect(semverFormat(semverParse('v1.2.3'))).toBe('1.2.3');
  });
});

describe('semverCompare', () => {
  test('compares by major, minor then patch', () => {
    expect(semverCompare('1.0.0', '2.0.0')).toBe(-1);
    expect(semverCompare('2.0.0', '1.0.0')).toBe(1);
    expect(semverCompare('1.2.3', '1.2.3')).toBe(0);
    expect(semverCompare('1.2.3', '1.3.0')).toBe(-1);
    expect(semverCompare('1.2.3', '1.2.4')).toBe(-1);
  });

  test('compares segments numerically, not as strings', () => {
    expect(semverCompare('1.2.3', '1.10.0')).toBe(-1);
    expect(semverCompare('1.9.0', '1.10.0')).toBe(-1);
    expect(semverCompare('2.0.0', '10.0.0')).toBe(-1);
  });

  test('ranks a pre-release below its release', () => {
    expect(semverCompare('1.0.0-alpha', '1.0.0')).toBe(-1);
    expect(semverCompare('1.0.0', '1.0.0-rc.1')).toBe(1);
  });

  test('follows the spec ordering for pre-release identifiers', () => {
    // The example chain from semver.org section 11.
    const ordered = [
      '1.0.0-alpha',
      '1.0.0-alpha.1',
      '1.0.0-alpha.beta',
      '1.0.0-beta',
      '1.0.0-beta.2',
      '1.0.0-beta.11',
      '1.0.0-rc.1',
      '1.0.0',
    ];

    for (let i = 0; i < ordered.length - 1; i++) {
      expect(semverCompare(ordered[i], ordered[i + 1])).toBe(-1);
      expect(semverCompare(ordered[i + 1], ordered[i])).toBe(1);
    }
  });

  test('ranks numeric identifiers below alphanumeric ones', () => {
    expect(semverCompare('1.0.0-1', '1.0.0-alpha')).toBe(-1);
    expect(semverCompare('1.0.0-999', '1.0.0-a')).toBe(-1);
  });

  test('compares numeric identifiers numerically', () => {
    expect(semverCompare('1.0.0-2', '1.0.0-11')).toBe(-1);
  });

  test('ranks a longer identifier list above its prefix', () => {
    expect(semverCompare('1.0.0-alpha', '1.0.0-alpha.1')).toBe(-1);
  });

  test('ignores build metadata', () => {
    expect(semverCompare('1.0.0+a', '1.0.0+b')).toBe(0);
    expect(semverCompare('1.0.0+build.1', '1.0.0')).toBe(0);
    expect(semverCompare('1.0.0-rc.1+a', '1.0.0-rc.1+b')).toBe(0);
  });

  test('works as an Array#sort comparator', () => {
    expect(['1.10.0', '1.2.3', '1.0.0'].sort(semverCompare)).toEqual([
      '1.0.0',
      '1.2.3',
      '1.10.0',
    ]);
  });

  test('throws on an invalid version', () => {
    expect(() => semverCompare('1.2', '1.2.3')).toThrow(TypeError);
  });
});

describe('semverSort', () => {
  test('sorts ascending by default', () => {
    expect(semverSort(['1.10.0', '1.2.3', '1.0.0'])).toEqual([
      '1.0.0',
      '1.2.3',
      '1.10.0',
    ]);
  });

  test('sorts descending on request', () => {
    expect(semverSort(['1.0.0', '1.10.0', '1.2.3'], 'desc')).toEqual([
      '1.10.0',
      '1.2.3',
      '1.0.0',
    ]);
  });

  test('orders pre-releases below their release', () => {
    expect(semverSort(['1.0.0', '1.0.0-rc.1', '1.0.0-alpha'])).toEqual([
      '1.0.0-alpha',
      '1.0.0-rc.1',
      '1.0.0',
    ]);
  });

  test('does not mutate the input', () => {
    const input = ['2.0.0', '1.0.0'];
    semverSort(input);
    expect(input).toEqual(['2.0.0', '1.0.0']);
  });

  test('preserves the original strings, including the v prefix', () => {
    expect(semverSort(['v2.0.0', 'v1.0.0'])).toEqual(['v1.0.0', 'v2.0.0']);
  });

  test('handles empty and single-element input', () => {
    expect(semverSort()).toEqual([]);
    expect(semverSort([])).toEqual([]);
    expect(semverSort(['1.0.0'])).toEqual(['1.0.0']);
  });

  test('throws on an invalid version', () => {
    expect(() => semverSort(['1.0.0', 'nope'])).toThrow(TypeError);
  });
});

describe('semverIncrement', () => {
  test('increments the plain releases', () => {
    expect(semverIncrement('1.2.3', 'major')).toBe('2.0.0');
    expect(semverIncrement('1.2.3', 'minor')).toBe('1.3.0');
    expect(semverIncrement('1.2.3', 'patch')).toBe('1.2.4');
  });

  test('resolves an in-progress pre-release rather than skipping it', () => {
    expect(semverIncrement('1.0.0-rc.1', 'major')).toBe('1.0.0');
    expect(semverIncrement('1.2.0-rc.1', 'minor')).toBe('1.2.0');
    expect(semverIncrement('1.2.3-rc.1', 'patch')).toBe('1.2.3');
  });

  test('still bumps when the pre-release is not of that release', () => {
    // 1.2.3-rc.1 is a patch pre-release, so the next major is 2.0.0.
    expect(semverIncrement('1.2.3-rc.1', 'major')).toBe('2.0.0');
    expect(semverIncrement('1.2.3-rc.1', 'minor')).toBe('1.3.0');
  });

  test('starts the pre-releases', () => {
    expect(semverIncrement('1.2.3', 'premajor')).toBe('2.0.0-0');
    expect(semverIncrement('1.2.3', 'preminor')).toBe('1.3.0-0');
    expect(semverIncrement('1.2.3', 'prepatch')).toBe('1.2.4-0');
    expect(semverIncrement('1.2.3', 'prerelease')).toBe('1.2.4-0');
  });

  test('starts the pre-releases with an identifier', () => {
    expect(semverIncrement('1.2.3', 'premajor', 'beta')).toBe('2.0.0-beta.0');
    expect(semverIncrement('1.2.3', 'preminor', 'beta')).toBe('1.3.0-beta.0');
    expect(semverIncrement('1.2.3', 'prepatch', 'beta')).toBe('1.2.4-beta.0');
  });

  test('bumps the trailing number of an existing pre-release', () => {
    expect(semverIncrement('1.3.0-beta.0', 'prerelease')).toBe('1.3.0-beta.1');
    expect(semverIncrement('1.3.0-beta.9', 'prerelease')).toBe('1.3.0-beta.10');
    expect(semverIncrement('1.3.0-0', 'prerelease')).toBe('1.3.0-1');
  });

  test('appends a counter when the pre-release has no number', () => {
    expect(semverIncrement('1.3.0-beta', 'prerelease')).toBe('1.3.0-beta.0');
  });

  test('restarts the series when the identifier changes', () => {
    expect(semverIncrement('1.3.0-alpha.5', 'prerelease', 'beta')).toBe(
      '1.3.0-beta.0',
    );
    expect(semverIncrement('1.3.0-beta.5', 'prerelease', 'beta')).toBe(
      '1.3.0-beta.6',
    );
    expect(semverIncrement('1.3.0-beta', 'prerelease', 'beta')).toBe(
      '1.3.0-beta.0',
    );
  });

  test('drops build metadata', () => {
    expect(semverIncrement('1.2.3+build.5', 'patch')).toBe('1.2.4');
    expect(semverIncrement('1.2.3-rc.1+build.5', 'prerelease')).toBe(
      '1.2.3-rc.2',
    );
  });

  test('throws on an unknown release', () => {
    expect(() => semverIncrement('1.2.3', 'nope' as never)).toThrow(
      'Invalid SemVer release: nope',
    );
  });

  test('throws on an invalid version', () => {
    expect(() => semverIncrement('1.2', 'patch')).toThrow(TypeError);
  });
});

describe('semverSatisfies', () => {
  test('matches exact versions', () => {
    expect(semverSatisfies('1.2.3', '1.2.3')).toBe(true);
    expect(semverSatisfies('1.2.3', '=1.2.3')).toBe(true);
    expect(semverSatisfies('1.2.4', '1.2.3')).toBe(false);
  });

  test('matches caret ranges above 1.0.0', () => {
    expect(semverSatisfies('1.2.3', '^1.2.3')).toBe(true);
    expect(semverSatisfies('1.2.4', '^1.2.3')).toBe(true);
    expect(semverSatisfies('1.9.9', '^1.2.3')).toBe(true);
    expect(semverSatisfies('1.2.2', '^1.2.3')).toBe(false);
    expect(semverSatisfies('2.0.0', '^1.2.3')).toBe(false);
  });

  test('pins caret ranges below 1.0.0 to the left-most non-zero segment', () => {
    expect(semverSatisfies('0.2.3', '^0.2.3')).toBe(true);
    expect(semverSatisfies('0.2.9', '^0.2.3')).toBe(true);
    expect(semverSatisfies('0.3.0', '^0.2.3')).toBe(false);

    expect(semverSatisfies('0.0.3', '^0.0.3')).toBe(true);
    expect(semverSatisfies('0.0.4', '^0.0.3')).toBe(false);
  });

  test('matches tilde ranges', () => {
    expect(semverSatisfies('1.2.3', '~1.2.3')).toBe(true);
    expect(semverSatisfies('1.2.9', '~1.2.3')).toBe(true);
    expect(semverSatisfies('1.3.0', '~1.2.3')).toBe(false);
    expect(semverSatisfies('1.2.0', '~1.2')).toBe(true);
    expect(semverSatisfies('1.3.0', '~1.2')).toBe(false);
    expect(semverSatisfies('1.5.0', '~1')).toBe(true);
    expect(semverSatisfies('2.0.0', '~1')).toBe(false);
  });

  test('matches wildcard and partial ranges', () => {
    expect(semverSatisfies('1.2.3', '*')).toBe(true);
    expect(semverSatisfies('1.2.3', '')).toBe(true);
    expect(semverSatisfies('1.9.0', '1.x')).toBe(true);
    expect(semverSatisfies('2.0.0', '1.x')).toBe(false);
    expect(semverSatisfies('1.2.9', '1.2.x')).toBe(true);
    expect(semverSatisfies('1.3.0', '1.2.x')).toBe(false);
    expect(semverSatisfies('1.2.9', '1.2')).toBe(true);
    expect(semverSatisfies('1.9.0', '1')).toBe(true);
  });

  test('matches comparators', () => {
    expect(semverSatisfies('1.2.4', '>1.2.3')).toBe(true);
    expect(semverSatisfies('1.2.3', '>1.2.3')).toBe(false);
    expect(semverSatisfies('1.2.3', '>=1.2.3')).toBe(true);
    expect(semverSatisfies('1.2.2', '<1.2.3')).toBe(true);
    expect(semverSatisfies('1.2.3', '<=1.2.3')).toBe(true);
    expect(semverSatisfies('1.2.4', '<=1.2.3')).toBe(false);
  });

  test('widens comparators against partial versions', () => {
    // `>1.2` excludes all of 1.2, so 1.2.9 is out but 1.3.0 is in.
    expect(semverSatisfies('1.2.9', '>1.2')).toBe(false);
    expect(semverSatisfies('1.3.0', '>1.2')).toBe(true);
    expect(semverSatisfies('1.9.9', '>1')).toBe(false);
    expect(semverSatisfies('2.0.0', '>1')).toBe(true);
    expect(semverSatisfies('1.2.9', '<=1.2')).toBe(true);
    expect(semverSatisfies('1.3.0', '<=1.2')).toBe(false);
  });

  test('tolerates whitespace between an operator and its version', () => {
    expect(semverSatisfies('1.2.4', '> 1.2.3')).toBe(true);
    expect(semverSatisfies('1.2.3', '>= 1.2.3')).toBe(true);
    expect(semverSatisfies('1.5.0', '>= 1.2.3 < 2.0.0')).toBe(true);
  });

  test('requires every comparator in a whitespace-joined set', () => {
    expect(semverSatisfies('1.5.0', '>=1.2.3 <2.0.0')).toBe(true);
    expect(semverSatisfies('2.0.0', '>=1.2.3 <2.0.0')).toBe(false);
    expect(semverSatisfies('1.0.0', '>=1.2.3 <2.0.0')).toBe(false);
  });

  test('matches any alternative across ||', () => {
    expect(semverSatisfies('1.5.0', '^1.2.3 || ^2.0.0')).toBe(true);
    expect(semverSatisfies('2.5.0', '^1.2.3 || ^2.0.0')).toBe(true);
    expect(semverSatisfies('3.0.0', '^1.2.3 || ^2.0.0')).toBe(false);
    expect(semverSatisfies('1.5.0', '>=1.2.3 <2.0.0 || 3.x')).toBe(true);
    expect(semverSatisfies('3.1.0', '>=1.2.3 <2.0.0 || 3.x')).toBe(true);
  });

  test('matches hyphen ranges', () => {
    expect(semverSatisfies('1.2.3', '1.2.3 - 2.3.4')).toBe(true);
    expect(semverSatisfies('2.3.4', '1.2.3 - 2.3.4')).toBe(true);
    expect(semverSatisfies('2.3.5', '1.2.3 - 2.3.4')).toBe(false);
    expect(semverSatisfies('1.2.2', '1.2.3 - 2.3.4')).toBe(false);
    // An open upper bound widens to the end of the segment given.
    expect(semverSatisfies('2.3.9', '1.2.3 - 2.3')).toBe(true);
    expect(semverSatisfies('2.4.0', '1.2.3 - 2.3')).toBe(false);
    expect(semverSatisfies('2.9.9', '1.2.3 - 2')).toBe(true);
    expect(semverSatisfies('3.0.0', '1.2.3 - 2')).toBe(false);
  });

  test('withholds pre-releases from ranges that did not ask for one', () => {
    expect(semverSatisfies('2.0.0-alpha', '>=1.0.0')).toBe(false);
    expect(semverSatisfies('2.0.0-alpha', '^1.2.3')).toBe(false);
    expect(semverSatisfies('1.2.4-alpha.0', '^1.2.3')).toBe(false);
    expect(semverSatisfies('1.0.0-alpha', '*')).toBe(false);
    expect(semverSatisfies('1.0.0-alpha', '1.x')).toBe(false);
  });

  test('offers a pre-release to a range naming one on the same version', () => {
    expect(semverSatisfies('1.2.3-rc.1', '>=1.2.3-rc.1')).toBe(true);
    expect(semverSatisfies('1.2.3-rc.2', '>=1.2.3-rc.1')).toBe(true);
    expect(semverSatisfies('1.2.3-rc.1', '^1.2.3-alpha')).toBe(true);
    // A different version's pre-release stays hidden.
    expect(semverSatisfies('1.2.4-rc.1', '^1.2.3-alpha')).toBe(false);
  });

  test('compares on precedence alone with includePrerelease', () => {
    const options = { includePrerelease: true };

    expect(semverSatisfies('2.0.0-alpha', '>=1.0.0', options)).toBe(true);
    expect(semverSatisfies('1.0.0-alpha', '1.x', options)).toBe(true);
    expect(semverSatisfies('1.0.0-alpha', '*', options)).toBe(true);
    expect(semverSatisfies('1.2.4-alpha.0', '^1.2.3', options)).toBe(true);
    // The upper bound still holds: 2.0.0-alpha is outside ^1.2.3.
    expect(semverSatisfies('2.0.0-alpha', '^1.2.3', options)).toBe(false);
  });

  test('matches a stable release the same way in both modes', () => {
    for (const [version, range] of [
      ['1.2.3', '^1.2.3'],
      ['1.5.0', '>=1.2.3 <2.0.0'],
      ['2.0.0', '^1.2.3'],
      ['0.2.9', '^0.2.3'],
    ] as [string, string][]) {
      expect(semverSatisfies(version, range, { includePrerelease: true })).toBe(
        semverSatisfies(version, range),
      );
    }
  });

  test('tolerates a v prefix on both sides', () => {
    expect(semverSatisfies('v1.2.3', '^v1.2.0')).toBe(true);
  });

  test('throws on an invalid version or range', () => {
    expect(() => semverSatisfies('1.2', '^1.0.0')).toThrow(TypeError);
    expect(() => semverSatisfies('1.2.3', 'not-a-range')).toThrow(TypeError);
    expect(() => semverSatisfies('1.2.3', '^^1.0.0')).toThrow(TypeError);
  });
});
