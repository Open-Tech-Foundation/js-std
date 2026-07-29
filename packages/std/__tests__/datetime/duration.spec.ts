import { DateTime, Duration } from '../../src';

/** New York, so the DST transitions are the well-known ones. */
const NY = 'America/New_York';

describe('Duration construction', () => {
  test('defaults to zero', () => {
    const d = new Duration();

    expect(d.toObject()).toEqual({
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    expect(d.isZero).toBe(true);
    expect(d.sign).toBe(0);
  });

  test('takes a fields object, filling the rest with zero', () => {
    const d = new Duration({ hours: 1, minutes: 30 });

    expect(d.hours).toBe(1);
    expect(d.minutes).toBe(30);
    expect(d.days).toBe(0);
  });

  test('takes milliseconds as a number', () => {
    expect(new Duration(1500).toObject().milliseconds).toBe(1500);
    expect(new Duration(-1500).milliseconds).toBe(-1500);
  });

  test('takes another Duration', () => {
    const d = new Duration({ days: 2 });

    expect(new Duration(d).toObject()).toEqual(d.toObject());
  });

  test('from passes a Duration through untouched', () => {
    const d = new Duration({ days: 2 });

    expect(Duration.from(d)).toBe(d);
    expect(Duration.from('PT1H').hours).toBe(1);
  });

  test('is frozen and exposes its fields as own properties', () => {
    const d = new Duration({ hours: 1 });

    expect(Object.isFrozen(d)).toBe(true);
    // Own and enumerable, so a Duration satisfies DurationLike structurally.
    expect(Object.keys(d).sort()).toEqual(
      [
        'days',
        'hours',
        'milliseconds',
        'minutes',
        'months',
        'seconds',
        'weeks',
        'years',
      ].sort(),
    );
  });

  test('rejects a non-integer field', () => {
    expect(() => new Duration({ hours: 1.5 })).toThrow(RangeError);
    expect(() => new Duration({ days: Number.NaN })).toThrow(RangeError);
    expect(() => new Duration({ days: Number.POSITIVE_INFINITY })).toThrow(
      RangeError,
    );
  });

  test('rejects fields whose signs disagree', () => {
    // ISO 8601 signs the duration as a whole, so this has no serialisable form.
    expect(() => new Duration({ hours: 1, minutes: -30 })).toThrow(RangeError);
    expect(() => new Duration({ months: 1, hours: -2 })).toThrow(RangeError);
    expect(() => new Duration({ months: 1, days: -1 })).toThrow(RangeError);
  });

  test('allows zero alongside either sign', () => {
    expect(() => new Duration({ hours: -1, minutes: 0 })).not.toThrow();
    expect(() => new Duration({ hours: 1, minutes: 0 })).not.toThrow();
  });

  test('rejects an unsupported input type', () => {
    expect(() => new Duration(true as never)).toThrow(TypeError);
    expect(() => new Duration(null as never)).toThrow(TypeError);
  });

  test('rejects non-finite milliseconds', () => {
    expect(() => new Duration(Number.NaN)).toThrow(RangeError);
  });
});

describe('Duration ISO 8601', () => {
  const cases: [string, Partial<Record<string, number>>][] = [
    ['PT1H30M', { hours: 1, minutes: 30 }],
    [
      'P1Y2M3DT4H5M6S',
      {
        years: 1,
        months: 2,
        days: 3,
        hours: 4,
        minutes: 5,
        seconds: 6,
      },
    ],
    ['P2W', { weeks: 2 }],
    ['P1D', { days: 1 }],
    ['PT0.5S', { milliseconds: 500 }],
    ['PT1.5S', { seconds: 1, milliseconds: 500 }],
    ['-PT30M', { minutes: -30 }],
    ['PT90S', { seconds: 90 }],
  ];

  for (const [iso, fields] of cases) {
    test(`parses ${iso}`, () => {
      const d = new Duration(iso);

      for (const [key, value] of Object.entries(fields)) {
        expect(d[key as 'hours']).toBe(value as number);
      }
    });

    test(`serialises ${iso}`, () => {
      expect(new Duration(iso).toString()).toBe(iso);
    });
  }

  test('round-trips without balancing', () => {
    // The stored shape survives: PT90S does not become PT1M30S.
    expect(new Duration('PT90S').minutes).toBe(0);
    expect(new Duration('PT90S').seconds).toBe(90);
  });

  test('writes zero as PT0S', () => {
    expect(new Duration().toString()).toBe('PT0S');
    expect(new Duration({ hours: 0 }).toString()).toBe('PT0S');
  });

  test('accepts a leading plus and a comma decimal separator', () => {
    expect(new Duration('+PT1H').hours).toBe(1);
    expect(new Duration('PT1,5S').milliseconds).toBe(500);
  });

  test('cascades a fraction into the smaller units', () => {
    expect(new Duration('PT1.5H').toObject()).toMatchObject({
      hours: 1,
      minutes: 30,
      seconds: 0,
    });
    expect(new Duration('PT1.5M').toObject()).toMatchObject({
      minutes: 1,
      seconds: 30,
    });
  });

  test('folds milliseconds into the seconds component', () => {
    // ISO has no millisecond unit, so they can only ride on the seconds field.
    expect(new Duration({ milliseconds: 1500 }).toString()).toBe('PT1.5S');
    expect(new Duration({ milliseconds: 90_000 }).toString()).toBe('PT90S');
    expect(new Duration({ seconds: 1, milliseconds: 5 }).toString()).toBe(
      'PT1.005S',
    );
  });

  test('survives JSON.stringify', () => {
    expect(JSON.stringify({ d: new Duration('PT1H') })).toBe('{"d":"PT1H"}');
  });

  test('rejects malformed strings', () => {
    for (const bad of ['', 'P', 'PT', '1H', 'P1H', 'PT1D', 'P1DT', 'hello']) {
      expect(() => new Duration(bad)).toThrow(RangeError);
    }
  });

  test('rejects a fraction on a calendar component', () => {
    // Half a year has no fixed length, so there is nothing to resolve it to.
    expect(() => new Duration('P1.5Y')).toThrow(RangeError);
    expect(() => new Duration('P1.5D')).toThrow(RangeError);
  });

  test('rejects a fraction on anything but the smallest component', () => {
    expect(() => new Duration('PT1.5H30M')).toThrow(RangeError);
    expect(() => new Duration('PT1.5M30S')).toThrow(RangeError);
  });
});

describe('Duration fields', () => {
  test('sign reports the shared direction', () => {
    expect(new Duration({ hours: 1 }).sign).toBe(1);
    expect(new Duration({ hours: -1 }).sign).toBe(-1);
    expect(new Duration().sign).toBe(0);
  });

  test('negated flips every field', () => {
    const d = new Duration({ days: 1, hours: 2 }).negated();

    expect(d.toObject()).toMatchObject({ days: -1, hours: -2 });
    expect(d.toString()).toBe('-P1DT2H');
  });

  test('negated does not leave a negative zero behind', () => {
    // -0 would compare equal to zero yet serialise with a stray sign.
    const d = new Duration({ hours: 1 }).negated();

    expect(Object.is(d.minutes, -0)).toBe(false);
    expect(d.toString()).toBe('-PT1H');
  });

  test('abs drops the sign', () => {
    expect(new Duration('-P1DT2H').abs().toString()).toBe('P1DT2H');
    expect(new Duration('P1D').abs().toString()).toBe('P1D');
  });

  test('with replaces the named fields only', () => {
    const d = new Duration({ hours: 1, minutes: 30 }).with({ minutes: 45 });

    expect(d.toObject()).toMatchObject({ hours: 1, minutes: 45 });
  });

  test('with revalidates', () => {
    expect(() => new Duration({ hours: 1 }).with({ minutes: -1 })).toThrow(
      RangeError,
    );
  });

  test('toObject returns a fresh mutable copy', () => {
    const d = new Duration({ hours: 1 });
    const o = d.toObject();

    o.hours = 99;

    expect(d.hours).toBe(1);
  });
});

describe('Duration arithmetic', () => {
  test('adds two exact durations without an anchor', () => {
    const d = new Duration({ hours: 1 }).add({ minutes: 30 });

    expect(d.toString()).toBe('PT1H30M');
  });

  test('balances the sum of exact durations', () => {
    expect(new Duration({ minutes: 45 }).add({ minutes: 30 }).toString()).toBe(
      'PT1H15M',
    );
    expect(new Duration('PT90S').add('PT90S').toString()).toBe('PT3M');
  });

  test('a mixed-sign sum resolves rather than throwing', () => {
    // The fields could not be constructed side by side, but their sum can.
    expect(new Duration({ hours: 1 }).add({ minutes: -90 }).toString()).toBe(
      '-PT30M',
    );
  });

  test('subtracts', () => {
    expect(new Duration('PT2H').subtract('PT30M').toString()).toBe('PT1H30M');
    expect(new Duration('PT30M').subtract('PT2H').toString()).toBe('-PT1H30M');
  });

  test('requires an anchor once a calendar unit is in play', () => {
    expect(() => new Duration({ months: 1 }).add({ days: 1 })).toThrow(
      RangeError,
    );
    expect(() => new Duration({ hours: 1 }).add({ months: 1 })).toThrow(
      RangeError,
    );
  });

  test('adds calendar units against an anchor', () => {
    const relativeTo = new DateTime('2026-01-01');
    const d = new Duration({ months: 1 }).add({ months: 1 }, { relativeTo });

    expect(d.toString()).toBe('P2M');
  });

  test('re-measures from the anchor rather than adding fields', () => {
    // From 31 January, one month clamps to 28 February and a second month
    // reaches 28 March — which is one month and 28 days from the anchor, not
    // two months. Calendar addition is not associative, and the result has to
    // describe where it actually landed.
    const relativeTo = new DateTime('2026-01-31');
    const d = new Duration({ months: 1 }).add({ months: 1 }, { relativeTo });

    expect(d.toString()).toBe('P1M28D');
    expect(relativeTo.add(d.toObject()).toISOString().slice(0, 10)).toBe(
      '2026-03-28',
    );
  });

  test('resolves calendar arithmetic where month lengths differ', () => {
    // 31 Jan + 1 month clamps to 28 Feb, and from there one month is 31 days.
    const relativeTo = new DateTime('2026-01-31');
    const d = new Duration({ months: 1 }).add({ days: 1 }, { relativeTo });

    expect(d.toString()).toBe('P1M1D');
    expect(relativeTo.add(d.toObject()).toISOString().slice(0, 10)).toBe(
      '2026-03-01',
    );
  });
});

describe('Duration comparison', () => {
  test('compares exact durations by length', () => {
    expect(new Duration('PT1H').compare('PT30M')).toBe(1);
    expect(new Duration('PT30M').compare('PT1H')).toBe(-1);
    expect(new Duration('PT1H').compare('PT60M')).toBe(0);
  });

  test('equals compares value, not shape', () => {
    expect(new Duration('PT1H').equals('PT60M')).toBe(true);
    expect(new Duration('PT90S').equals('PT1M30S')).toBe(true);
    expect(new Duration('PT1H').equals('PT1H1S')).toBe(false);
  });

  test('the static compare sorts', () => {
    const sorted = [
      new Duration('PT2H'),
      new Duration('PT30M'),
      new Duration('PT1H'),
    ]
      .sort((a, b) => Duration.compare(a, b))
      .map((d) => d.toString());

    expect(sorted).toEqual(['PT30M', 'PT1H', 'PT2H']);
  });

  test('requires an anchor to compare calendar durations', () => {
    expect(() => new Duration('P1M').compare('P30D')).toThrow(RangeError);
  });

  test('compares calendar durations against an anchor', () => {
    // A month is longer than 30 days in March, shorter in February.
    const march = { relativeTo: new DateTime('2026-03-01') };
    const february = { relativeTo: new DateTime('2026-02-01') };

    expect(new Duration('P1M').compare('P30D', march)).toBe(1);
    expect(new Duration('P1M').compare('P30D', february)).toBe(-1);
  });

  test('valueOf throws rather than comparing something meaningless', () => {
    expect(() => new Duration('PT1H').valueOf()).toThrow(TypeError);
    // The guard is what stops `<` from silently doing the wrong thing.
    expect(() => new Duration('PT1H') < new Duration('PT2H')).toThrow(
      TypeError,
    );
  });

  test('toString still works in a template literal', () => {
    expect(`${new Duration('PT1H')}`).toBe('PT1H');
  });
});

describe('Duration.between', () => {
  test('measures forwards and backwards', () => {
    const a = new DateTime('2026-01-01T00:00');
    const b = new DateTime('2026-01-03T03:00');

    expect(Duration.between(a, b).toString()).toBe('P2DT3H');
    expect(Duration.between(b, a).toString()).toBe('-P2DT3H');
  });

  test('returns zero for the same instant', () => {
    const a = new DateTime('2026-01-01');

    expect(Duration.between(a, a).toString()).toBe('PT0S');
  });

  test('defaults to days as the coarsest unit', () => {
    const a = new DateTime('2026-01-01');
    const b = new DateTime('2026-03-01');

    expect(Duration.between(a, b).toString()).toBe('P59D');
  });

  test('honours largestUnit', () => {
    const a = new DateTime('2026-01-01');
    const b = new DateTime('2026-03-15');

    expect(Duration.between(a, b, { largestUnit: 'month' }).toString()).toBe(
      'P2M14D',
    );
    // 31 + 28 + 14 = 73 days.
    expect(Duration.between(a, b, { largestUnit: 'hour' }).toString()).toBe(
      'PT1752H',
    );
  });

  test('counts a DST day as one day, not 23 or 25 hours', () => {
    // 8 March 2026 is the spring-forward date in New York.
    const a = new DateTime('2026-03-07T12:00', { timeZone: NY });
    const b = new DateTime('2026-03-08T12:00', { timeZone: NY });

    expect(Duration.between(a, b).toString()).toBe('P1D');
    // The same span in exact units really is 23 hours.
    expect(Duration.between(a, b, { largestUnit: 'hour' }).toString()).toBe(
      'PT23H',
    );
  });

  test('round-trips through DateTime.add', () => {
    const a = new DateTime('2026-01-31T08:30', { timeZone: NY });
    const b = new DateTime('2026-05-02T17:45', { timeZone: NY });

    for (const largestUnit of ['year', 'month', 'day', 'hour'] as const) {
      const d = Duration.between(a, b, { largestUnit });

      expect(a.add(d.toObject()).epochMs).toBe(b.epochMs);
    }
  });

  test('rejects a non-DateTime', () => {
    expect(() =>
      Duration.between('2026-01-01' as never, new DateTime()),
    ).toThrow(TypeError);
  });

  test('rejects an unknown largestUnit', () => {
    expect(() =>
      Duration.between(new DateTime(), new DateTime(), {
        largestUnit: 'fortnight' as never,
      }),
    ).toThrow(RangeError);
  });
});

describe('Duration with DateTime', () => {
  test('DateTime.add accepts a Duration instance', () => {
    const dt = new DateTime('2026-01-01T00:00');

    expect(dt.add(new Duration('P1DT2H')).toISOString()).toBe(
      '2026-01-02T02:00:00.000+00:00[UTC]',
    );
  });

  test('DateTime.subtract accepts a Duration instance', () => {
    // Works because Duration keeps its fields as own enumerable properties.
    // `subtract` reads the known unit list rather than the instance's own keys
    // so that this keeps working if that ever stops being true.
    const dt = new DateTime('2026-01-02T02:00');

    expect(dt.subtract(new Duration('P1DT2H')).toISOString()).toBe(
      '2026-01-01T00:00:00.000+00:00[UTC]',
    );
  });

  test('subtracting a Duration is the inverse of adding it', () => {
    const dt = new DateTime('2026-03-08T12:00', { timeZone: NY });
    const d = new Duration('P1M2DT3H');

    expect(dt.add(d.toObject()).subtract(d.toObject()).epochMs).toBe(
      dt.epochMs,
    );
  });
});

/**
 * Declared only where Temporal exists, matching the backend-equivalence block
 * in `datetime.spec.ts`. The cross-runtime harness has no `test.skip` — a test
 * declared without a body is its skip — so a guard on the describe is the one
 * form that works under both it and `bun test`.
 */
if (DateTime.hasTemporal) {
  describe('Duration Temporal interop', () => {
    test('converts to a Temporal.Duration', () => {
      const temporal = new Duration('P1DT2H30M').toTemporal() as {
        toString(): string;
      };

      expect(temporal.toString()).toBe('P1DT2H30M');
    });

    test('converts back from a Temporal.Duration', () => {
      const source = new Duration('P1Y2M3DT4H5M6S');
      const round = Duration.fromTemporal(
        source.toTemporal() as Record<string, number>,
      );

      expect(round.toString()).toBe(source.toString());
    });

    test('rejects a value that is not a Temporal.Duration', () => {
      expect(() => Duration.fromTemporal({} as never)).toThrow(TypeError);
    });
  });
}

describe('Duration.total', () => {
  test('measures an exact duration without an anchor', () => {
    expect(new Duration('PT90M').total('hour')).toBe(1.5);
    expect(new Duration('PT1H').total('minute')).toBe(60);
    expect(new Duration('PT1.5S').total('millisecond')).toBe(1500);
    expect(new Duration({ hours: 90 }).total('hour')).toBe(90);
  });

  test('keeps the sign', () => {
    expect(new Duration('-PT90M').total('hour')).toBe(-1.5);
  });

  test('is zero for a zero duration', () => {
    expect(new Duration().total('hour')).toBe(0);
  });

  test('requires an anchor for a calendar duration', () => {
    expect(() => new Duration('P1M').total('day')).toThrow(RangeError);
  });

  test('requires an anchor for a calendar unit', () => {
    // The duration is exact, but months still have no fixed length.
    expect(() => new Duration('PT720H').total('month')).toThrow(RangeError);
  });

  test('measures days as exact time only against an anchor', () => {
    // A plain P1D is 24 hours in UTC...
    const utc = { relativeTo: new DateTime('2026-03-08') };

    expect(new Duration('P1D').total('hour', utc)).toBe(24);

    // ...but 23 across the spring-forward boundary in New York.
    const ny = {
      relativeTo: new DateTime('2026-03-07T12:00', { timeZone: NY }),
    };

    expect(new Duration('P1D').total('hour', ny)).toBe(23);
  });

  test('measures a month against the month it actually spans', () => {
    expect(
      new Duration('P1M').total('day', {
        relativeTo: new DateTime('2026-02-01'),
      }),
    ).toBe(28);
    expect(
      new Duration('P1M').total('day', {
        relativeTo: new DateTime('2026-03-01'),
      }),
    ).toBe(31);
  });

  test('returns a fraction of the unit that actually follows', () => {
    // Half of a 28-day February, measured from 1 January.
    const relativeTo = new DateTime('2026-01-01');

    expect(new Duration('P1M14D').total('month', { relativeTo })).toBe(1.5);
    expect(new Duration('P45D').total('month', { relativeTo })).toBeCloseTo(
      1 + 14 / 28,
      10,
    );
  });

  test('measures backwards', () => {
    const relativeTo = new DateTime('2026-03-01');

    expect(new Duration('-P1M').total('day', { relativeTo })).toBe(-28);
    expect(new Duration('-P1M').total('month', { relativeTo })).toBe(-1);
  });

  test('agrees with between over the same span', () => {
    const a = new DateTime('2026-01-01T00:00', { timeZone: NY });
    const b = new DateTime('2026-07-04T06:30', { timeZone: NY });
    const d = Duration.between(a, b, { largestUnit: 'year' });

    expect(d.total('hour', { relativeTo: a })).toBe(
      (b.epochMs - a.epochMs) / 3_600_000,
    );
  });

  test('rejects an unknown unit', () => {
    expect(() => new Duration('PT1H').total('fortnight' as never)).toThrow(
      RangeError,
    );
  });
});

describe('Duration.round', () => {
  test('balances when given only a largestUnit', () => {
    expect(
      new Duration('PT90S').round({ largestUnit: 'minute' }).toString(),
    ).toBe('PT1M30S');
    expect(
      new Duration({ minutes: 90 }).round({ largestUnit: 'hour' }).toString(),
    ).toBe('PT1H30M');
  });

  test('does not invent units coarser than the duration already uses', () => {
    expect(new Duration('PT90S').round().toString()).toBe('PT90S');
  });

  test('rounds to a smallestUnit', () => {
    expect(
      new Duration('PT1H30M').round({ smallestUnit: 'hour' }).toString(),
    ).toBe('PT2H');
    expect(
      new Duration('PT1H29M').round({ smallestUnit: 'hour' }).toString(),
    ).toBe('PT1H');
  });

  test('honours every rounding mode', () => {
    const d = new Duration('PT1H30M');
    const modes = {
      trunc: 'PT1H',
      floor: 'PT1H',
      ceil: 'PT2H',
      halfExpand: 'PT2H',
    } as const;

    for (const [roundingMode, expected] of Object.entries(modes)) {
      expect(
        d
          .round({ smallestUnit: 'hour', roundingMode: roundingMode as never })
          .toString(),
      ).toBe(expected);
    }
  });

  test('rounds negatives away from zero on halfExpand, not toward it', () => {
    // Math.round would send -0.5 to zero while sending 0.5 to one.
    const d = new Duration('-PT30M');

    expect(d.round({ smallestUnit: 'hour' }).toString()).toBe('-PT1H');
    expect(
      new Duration('PT30M').round({ smallestUnit: 'hour' }).toString(),
    ).toBe('PT1H');
  });

  test('floor and ceil follow the number line, not the magnitude', () => {
    const d = new Duration('-PT1H30M');

    expect(
      d.round({ smallestUnit: 'hour', roundingMode: 'floor' }).toString(),
    ).toBe('-PT2H');
    expect(
      d.round({ smallestUnit: 'hour', roundingMode: 'ceil' }).toString(),
    ).toBe('-PT1H');
    expect(
      d.round({ smallestUnit: 'hour', roundingMode: 'trunc' }).toString(),
    ).toBe('-PT1H');
  });

  test('rounds calendar units against an anchor', () => {
    const relativeTo = new DateTime('2026-01-01');

    expect(
      new Duration('P1M20D')
        .round({ smallestUnit: 'month', relativeTo })
        .toString(),
    ).toBe('P2M');
    expect(
      new Duration('P1M2D')
        .round({ smallestUnit: 'month', relativeTo })
        .toString(),
    ).toBe('P1M');
  });

  test('rebalances into calendar units', () => {
    const relativeTo = new DateTime('2026-01-01');

    expect(
      new Duration('P45D')
        .round({ largestUnit: 'month', relativeTo })
        .toString(),
    ).toBe('P1M14D');
  });

  test('requires an anchor for calendar rounding', () => {
    expect(() => new Duration('P45D').round({ largestUnit: 'month' })).toThrow(
      RangeError,
    );
  });

  test('rejects an unknown mode or unit', () => {
    const d = new Duration('PT1H');

    expect(() => d.round({ roundingMode: 'nearest' as never })).toThrow(
      RangeError,
    );
    expect(() => d.round({ smallestUnit: 'fortnight' as never })).toThrow(
      RangeError,
    );
  });

  test('rejects a largestUnit finer than the smallestUnit', () => {
    expect(() =>
      new Duration('PT1H').round({
        smallestUnit: 'minute',
        largestUnit: 'second',
      }),
    ).toThrow(RangeError);
  });

  test('a rounded duration still measures what it says', () => {
    const relativeTo = new DateTime('2026-01-15T08:20', { timeZone: NY });
    const d = new Duration('P2M13DT7H41M').round({
      smallestUnit: 'hour',
      largestUnit: 'month',
      relativeTo,
    });

    expect(Number.isInteger(d.total('hour', { relativeTo }))).toBe(true);
  });
});

describe('Duration.format', () => {
  test('renders a clock pattern', () => {
    expect(new Duration('PT1H30M').format('H:mm:ss')).toBe('1:30:00');
    expect(new Duration('PT1H30M5S').format('HH:mm:ss')).toBe('01:30:05');
  });

  test('splits at the coarsest exact token the pattern asks for', () => {
    const d = new Duration('PT90M');

    // The hour is kept when there is somewhere to put it, folded in when not.
    expect(d.format('H:mm')).toBe('1:30');
    expect(d.format('m')).toBe('90');
    expect(d.format('s')).toBe('5400');
  });

  test('rebalances the stored fields', () => {
    // Storage is unbalanced, so without this PT90S would read 0:00:90.
    expect(new Duration('PT90S').format('H:mm:ss')).toBe('0:01:30');
  });

  test('zero-pads the doubled tokens only', () => {
    const d = new Duration('PT5M');

    expect(d.format('m')).toBe('5');
    expect(d.format('mm')).toBe('05');
  });

  test('renders milliseconds to three places', () => {
    expect(new Duration('PT1.5S').format('s.SSS')).toBe('1.500');
    expect(new Duration({ milliseconds: 7 }).format('s.SSS')).toBe('0.007');
  });

  test('uses calendar fields as stored', () => {
    const d = new Duration('P1Y2M3W4D');

    expect(d.format("y'y' M'm' w'w' d'd'")).toBe('1y 2m 3w 4d');
    expect(d.format('yy-MM-dd')).toBe('01-02-04');
  });

  test('treats quoted text as literal', () => {
    expect(new Duration('PT2H').format("H'h'")).toBe('2h');
    // A quoted run is literal, so its letters are not tokens.
    expect(new Duration('PT2H').format("'Hms' H")).toBe('Hms 2');
  });

  test('renders a doubled quote as one quote', () => {
    expect(new Duration('PT2H').format("H''")).toBe("2'");
  });

  test('prefixes a negative duration once', () => {
    expect(new Duration('-PT1H30M').format('H:mm')).toBe('-1:30');
    expect(new Duration('-P1DT2H').format("d'd' H'h'")).toBe('-1d 2h');
  });

  test('renders zero', () => {
    expect(new Duration().format('H:mm:ss')).toBe('0:00:00');
  });

  test('is independent of the ambient locale', () => {
    // No names to localise, so the bytes are fixed.
    expect(new Duration('P1M2DT3H').format('M-dd HH')).toBe('1-02 03');
  });
});

describe('Duration.toLocaleString', () => {
  test('renders the units in use', () => {
    const text = new Duration('PT1H30M').toLocaleString('en-US');

    expect(text).toContain('1');
    expect(text).toContain('30');
    expect(text.toLowerCase()).toMatch(/h|min/);
  });

  test('omits zero fields', () => {
    expect(new Duration('PT30M').toLocaleString('en-US')).not.toMatch(/\b0\b/);
  });

  test('renders zero as a zero span rather than an empty string', () => {
    // Intl.DurationFormat gives '' for an all-zero duration, which reads as a
    // bug wherever the result is a label.
    expect(new Duration().toLocaleString('en-US')).toBe('0 sec');
  });

  test('lets an explicit secondsDisplay win', () => {
    expect(
      new Duration().toLocaleString('en-US', { secondsDisplay: 'auto' }),
    ).toBe('');
  });

  test('renders calendar and exact units together', () => {
    const text = new Duration('P1DT2H').toLocaleString('en-US');

    expect(text).toContain('1');
    expect(text).toContain('2');
  });
});

describe('Duration.toRelative', () => {
  test('renders the past and the future', () => {
    expect(new Duration({ hours: -3 }).toRelative('en-US')).toBe('3 hours ago');
    expect(new Duration({ days: 2 }).toRelative('en-US')).toBe('in 2 days');
  });

  test('uses the singular for one', () => {
    expect(new Duration({ days: -1 }).toRelative('en-US')).toBe('1 day ago');
  });

  test('shows only the coarsest unit in use', () => {
    // Relative phrasing does not carry a remainder; round first to choose.
    expect(new Duration('PT1H30M').toRelative('en-US')).toBe('in 1 hour');
  });

  test('expresses milliseconds in seconds', () => {
    // Intl.RelativeTimeFormat has no millisecond unit.
    expect(new Duration({ milliseconds: -1500 }).toRelative('en-US')).toBe(
      '1.5 seconds ago',
    );
  });

  test('renders zero', () => {
    expect(new Duration().toRelative('en-US')).toBe('in 0 seconds');
  });

  test('renders calendar units', () => {
    expect(new Duration({ months: -2 }).toRelative('en-US')).toBe(
      '2 months ago',
    );
    expect(new Duration({ years: 1 }).toRelative('en-US')).toBe('in 1 year');
  });
});

describe('Duration formatting without Intl', () => {
  const intl = globalThis.Intl as Record<string, unknown>;
  const duration = intl.DurationFormat;
  const relative = intl.RelativeTimeFormat;

  afterEach(() => {
    intl.DurationFormat = duration;
    intl.RelativeTimeFormat = relative;
  });

  test('falls back to English when Intl.DurationFormat is absent', () => {
    intl.DurationFormat = undefined;

    expect(new Duration('PT1H30M').toLocaleString()).toBe('1 hr, 30 min');
    expect(new Duration('P1DT2H').toLocaleString()).toBe('1 day, 2 hr');
    expect(new Duration('P1Y2M').toLocaleString()).toBe('1 yr, 2 mths');
  });

  test('the fallback agrees with Intl on shape and on zero', () => {
    const cases = ['PT1H30M', 'P1DT2H', 'PT30M'];
    const native = cases.map((iso) =>
      new Duration(iso).toLocaleString('en-US'),
    );

    intl.DurationFormat = undefined;

    expect(
      cases.map((iso) => new Duration(iso).toLocaleString('en-US')),
    ).toEqual(native);
    expect(new Duration().toLocaleString('en-US')).toBe('0 sec');
  });

  test('falls back to English when Intl.RelativeTimeFormat is absent', () => {
    intl.RelativeTimeFormat = undefined;

    expect(new Duration({ hours: -3 }).toRelative()).toBe('3 hours ago');
    expect(new Duration({ days: 2 }).toRelative()).toBe('in 2 days');
    expect(new Duration({ days: -1 }).toRelative()).toBe('1 day ago');
    expect(new Duration().toRelative()).toBe('in 0 seconds');
  });

  test('format needs no Intl at all', () => {
    intl.DurationFormat = undefined;
    intl.RelativeTimeFormat = undefined;

    expect(new Duration('PT1H30M').format('H:mm:ss')).toBe('1:30:00');
  });
});
