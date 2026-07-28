import { parsePrerelease } from './tryParseSemver';
import type { Semver } from './tryParseSemver';

/** `*` matches every version and never opens a range up to pre-releases. */
export type ComparatorOp = '<' | '<=' | '>' | '>=' | '=' | '*';

export interface Comparator {
  op: ComparatorOp;
  semver: Semver;
}

/**
 * A version with wildcard segments left as `null`, which is how the segments a
 * range omits (`1.2`, `1.x`, `*`) are represented before expansion.
 */
interface PartialVersion {
  major: number | null;
  minor: number | null;
  patch: number | null;
  prerelease: (string | number)[];
}

const PARTIAL_REGEX =
  /^v?(0|[1-9]\d*|[xX*])(?:\.(0|[1-9]\d*|[xX*]))?(?:\.(0|[1-9]\d*|[xX*]))?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?:[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

const OPERATOR_REGEX = /^(~>|[~^]|>=|<=|[><=])?(.*)$/;

const HYPHEN_REGEX = /^(.+?)\s+-\s+(.+)$/;

function segment(value: string | undefined): number | null {
  if (value === undefined || value === 'x' || value === 'X' || value === '*') {
    return null;
  }

  return Number.parseInt(value, 10);
}

function parsePartial(input: string): PartialVersion | null {
  // An empty range, or a bare `*`, means "any version".
  if (input === '' || input === '*' || input === 'x' || input === 'X') {
    return { major: null, minor: null, patch: null, prerelease: [] };
  }

  const match = PARTIAL_REGEX.exec(input.trim());

  if (!match) {
    return null;
  }

  const major = segment(match[1]);
  // A wildcard makes every segment to its right a wildcard too, so `x.2.3`
  // and `1.x.3` collapse to `*` and `1.x`.
  const minor = major === null ? null : segment(match[2]);
  const patch = minor === null ? null : segment(match[3]);

  return {
    major,
    minor,
    patch,
    prerelease: parsePrerelease(match[4] ?? ''),
  };
}

/** Matches every version, and is invisible to the pre-release gate. */
function any(): Comparator {
  return {
    op: '*',
    semver: { major: 0, minor: 0, patch: 0, prerelease: [], build: [] },
  };
}

/** Matches nothing, since no version sorts below the lowest pre-release of `0.0.0`. */
function none(): Comparator {
  return {
    op: '<',
    semver: { major: 0, minor: 0, patch: 0, prerelease: [0], build: [] },
  };
}

/**
 * Builds the comparators a range expands to.
 *
 * The `-0` markers below are what make boundaries behave. An upper bound
 * synthesized from an incomplete version always carries one, so `^1.2.3` stops
 * at `<2.0.0-0` and refuses the unreleased `2.0.0-alpha`. A lower bound only
 * carries one under `includePrerelease`, and only when it too was synthesized —
 * `^1.2.3` still means `>=1.2.3` exactly, so it never reaches back into
 * `1.2.3-alpha`.
 */
class Builder {
  constructor(private readonly includePrerelease: boolean) {}

  /**
   * @param synthesized Whether this bound was manufactured from a wildcard or
   * omitted segment rather than written out in full by the range.
   */
  private lower(
    major: number,
    minor: number,
    patch: number,
    prerelease: (string | number)[],
    synthesized: boolean,
  ): Comparator {
    const pre =
      prerelease.length > 0
        ? prerelease
        : this.includePrerelease && synthesized
          ? [0]
          : [];

    // `>=0.0.0` admits everything, so it carries no information and would only
    // confuse the pre-release gate.
    if (major === 0 && minor === 0 && patch === 0 && pre.length === 0) {
      return any();
    }

    return {
      op: '>=',
      semver: { major, minor, patch, prerelease: pre, build: [] },
    };
  }

  private upper(
    major: number,
    minor: number,
    patch: number,
    prerelease: (string | number)[],
    synthesized: boolean,
  ): Comparator {
    const pre = prerelease.length > 0 ? prerelease : synthesized ? [0] : [];

    return {
      op: '<',
      semver: { major, minor, patch, prerelease: pre, build: [] },
    };
  }

  private exact(p: PartialVersion): Comparator {
    return {
      op: '=',
      semver: {
        major: p.major as number,
        minor: p.minor as number,
        patch: p.patch as number,
        prerelease: p.prerelease,
        build: [],
      },
    };
  }

  private simple(op: ComparatorOp, p: PartialVersion): Comparator {
    return {
      op,
      semver: {
        major: p.major as number,
        minor: p.minor as number,
        patch: p.patch as number,
        prerelease: p.prerelease,
        build: [],
      },
    };
  }

  caret(p: PartialVersion): Comparator[] {
    const { major, minor, patch, prerelease } = p;

    if (major === null) return [any()];

    if (minor === null) {
      return [
        this.lower(major, 0, 0, [], true),
        this.upper(major + 1, 0, 0, [], true),
      ];
    }

    if (patch === null) {
      // Below 1.0.0 a minor bump is allowed to break, so `^0.2.x` pins to 0.2.
      return major > 0
        ? [
            this.lower(major, minor, 0, [], true),
            this.upper(major + 1, 0, 0, [], true),
          ]
        : [
            this.lower(0, minor, 0, [], true),
            this.upper(0, minor + 1, 0, [], true),
          ];
    }

    const start = this.lower(major, minor, patch, prerelease, false);

    // The left-most non-zero segment is the one held stable, so `^0.0.3`
    // allows nothing beyond that exact patch.
    if (major > 0) return [start, this.upper(major + 1, 0, 0, [], true)];
    if (minor > 0) return [start, this.upper(0, minor + 1, 0, [], true)];

    return [start, this.upper(0, 0, patch + 1, [], true)];
  }

  tilde(p: PartialVersion): Comparator[] {
    const { major, minor, patch, prerelease } = p;

    if (major === null) return [any()];

    if (minor === null) {
      return [
        this.lower(major, 0, 0, [], true),
        this.upper(major + 1, 0, 0, [], true),
      ];
    }

    return [
      this.lower(major, minor, patch ?? 0, prerelease, patch === null),
      this.upper(major, minor + 1, 0, [], true),
    ];
  }

  equals(p: PartialVersion): Comparator[] {
    const { major, minor, patch } = p;

    if (major === null) return [any()];

    if (minor === null) {
      return [
        this.lower(major, 0, 0, [], true),
        this.upper(major + 1, 0, 0, [], true),
      ];
    }

    if (patch === null) {
      return [
        this.lower(major, minor, 0, [], true),
        this.upper(major, minor + 1, 0, [], true),
      ];
    }

    return [this.exact(p)];
  }

  /**
   * Expands an inequality. A wildcard segment moves the bound outward to the
   * edge of the segment that was given: `>1.2` excludes all of 1.2, so it
   * becomes `>=1.3.0`.
   */
  inequality(op: string, p: PartialVersion): Comparator[] {
    const { major, minor, patch, prerelease } = p;

    if (major === null) {
      return [op === '>=' || op === '<=' ? any() : none()];
    }

    const isPartial = minor === null || patch === null;

    switch (op) {
      case '>':
        if (minor === null) return [this.lower(major + 1, 0, 0, [], true)];
        if (patch === null) return [this.lower(major, minor + 1, 0, [], true)];
        return [this.simple('>', p)];

      case '>=':
        return [
          this.lower(major, minor ?? 0, patch ?? 0, prerelease, isPartial),
        ];

      case '<':
        if (!isPartial) return [this.simple('<', p)];
        return [this.upper(major, minor ?? 0, patch ?? 0, prerelease, true)];

      default:
        if (minor === null) return [this.upper(major + 1, 0, 0, [], true)];
        if (patch === null) return [this.upper(major, minor + 1, 0, [], true)];
        return [this.simple('<=', p)];
    }
  }

  hyphen(from: string, to: string): Comparator[] {
    const lower = parsePartial(from);
    const upper = parsePartial(to);

    if (lower === null || upper === null) {
      return [];
    }

    // A hyphen range's lower bound reaches back to the pre-releases of its
    // first version under `includePrerelease`, even when written out in full.
    const start =
      lower.major === null
        ? any()
        : this.lower(
            lower.major,
            lower.minor ?? 0,
            lower.patch ?? 0,
            lower.prerelease,
            true,
          );

    // An open upper bound widens to the end of the segment that was given, so
    // `1.2.3 - 2.3` reaches every 2.3.x.
    let end: Comparator;

    if (upper.major === null) {
      end = any();
    } else if (upper.minor === null) {
      end = this.upper(upper.major + 1, 0, 0, [], true);
    } else if (upper.patch === null) {
      end = this.upper(upper.major, upper.minor + 1, 0, [], true);
    } else if (this.includePrerelease && upper.prerelease.length === 0) {
      // `<=2.3.4` has to become `<2.3.5-0`, or it would also admit 2.3.5-alpha.
      end = this.upper(upper.major, upper.minor, upper.patch + 1, [], true);
    } else {
      end = this.simple('<=', upper);
    }

    return [start, end];
  }

  token(token: string): Comparator[] {
    const match = OPERATOR_REGEX.exec(token);

    if (!match) {
      return [];
    }

    const op = match[1] ?? '';
    const partial = parsePartial(match[2]);

    if (partial === null) {
      return [];
    }

    switch (op) {
      case '^':
        return this.caret(partial);
      case '~':
      case '~>':
        return this.tilde(partial);
      case '':
      case '=':
        return this.equals(partial);
      default:
        return this.inequality(op, partial);
    }
  }

  set(group: string): Comparator[] {
    const trimmed = group.trim();

    if (trimmed === '') {
      return [any()];
    }

    const hyphen = HYPHEN_REGEX.exec(trimmed);

    if (hyphen) {
      const comparators = this.hyphen(hyphen[1], hyphen[2]);

      if (comparators.length === 0) {
        throw new TypeError(`Invalid SemVer range: ${group}`);
      }

      return comparators;
    }

    // Detach an operator from its operand so `> 1.2.3` splits as one token.
    const normalized = trimmed.replace(/(^|\s)(>=|<=|[><=~^]|~>)\s+/g, '$1$2');
    const comparators: Comparator[] = [];

    for (const token of normalized.split(/\s+/)) {
      const expanded = this.token(token);

      if (expanded.length === 0) {
        throw new TypeError(`Invalid SemVer range: ${group}`);
      }

      comparators.push(...expanded);
    }

    return comparators;
  }
}

/**
 * Parses a range into a disjunction of comparator sets: the outer array is
 * joined by `||`, and every comparator in an inner array must hold.
 */
export default function parseRange(
  range: string,
  includePrerelease = false,
): Comparator[][] {
  if (typeof range !== 'string') {
    throw new TypeError(`Invalid SemVer range: ${String(range)}`);
  }

  const builder = new Builder(includePrerelease);

  return range.split('||').map((group) => builder.set(group));
}
