import { DateTime } from '../../src';

/**
 * Every assertion runs against both civil backends.
 *
 * The Temporal backend only exists on runtimes that ship Temporal (Deno,
 * ES-Runtime, flagged Node.js), so on Bun and default Node.js only the `Intl`
 * pass runs. Where both are available the final block asserts they agree, which
 * is the real check on the hand-rolled `Intl` offset resolution.
 */
const backends = DateTime.hasTemporal
  ? (['intl', 'temporal'] as const)
  : (['intl'] as const);

for (const backend of backends) {
  describe(`DateTime (${backend} backend)`, () => {
    beforeEach(() => {
      DateTime._setBackend(backend);
    });

    afterEach(() => {
      DateTime._setBackend(null);
    });

    describe('construction', () => {
      test('parses an ISO date', () => {
        const dt = new DateTime('2026-07-29');

        expect(dt.year).toBe(2026);
        expect(dt.month).toBe(7);
        expect(dt.day).toBe(29);
        expect(dt.hour).toBe(0);
        expect(dt.timeZone).toBe('UTC');
      });

      test('parses a full ISO date-time', () => {
        const dt = new DateTime('2026-07-29T14:30:15.250');

        expect(dt.hour).toBe(14);
        expect(dt.minute).toBe(30);
        expect(dt.second).toBe(15);
        expect(dt.millisecond).toBe(250);
      });

      test('honours an explicit offset', () => {
        const dt = new DateTime('2026-07-29T14:30:00+05:30');

        expect(dt.epochMs).toBe(Date.UTC(2026, 6, 29, 9, 0, 0));
      });

      test('honours a bracketed zone', () => {
        const dt = new DateTime('2026-07-29T14:30:00[Asia/Kolkata]');

        expect(dt.timeZone).toBe('Asia/Kolkata');
        expect(dt.epochMs).toBe(Date.UTC(2026, 6, 29, 9, 0, 0));
      });

      test('accepts epoch milliseconds, Date and DateTime', () => {
        const ms = Date.UTC(2026, 6, 29, 12);

        expect(new DateTime(ms).epochMs).toBe(ms);
        expect(new DateTime(new Date(ms)).epochMs).toBe(ms);
        expect(new DateTime(new DateTime(ms)).epochMs).toBe(ms);
      });

      test('rezones an existing instance without moving the instant', () => {
        const utc = new DateTime('2026-07-29T12:00:00');
        const kolkata = new DateTime(utc, { timeZone: 'Asia/Kolkata' });

        expect(kolkata.epochMs).toBe(utc.epochMs);
        expect(kolkata.hour).toBe(17);
        expect(kolkata.minute).toBe(30);
      });

      test('accepts a fields object', () => {
        const dt = new DateTime(
          { year: 2026, month: 7, day: 29, hour: 14 },
          { timeZone: 'Asia/Kolkata' },
        );

        expect(dt.hour).toBe(14);
        expect(dt.offset).toBe('+05:30');
      });

      test('defaults to the current time', () => {
        const before = Date.now();
        const dt = new DateTime();

        expect(dt.epochMs).toBeGreaterThanOrEqual(before);
        expect(dt.epochMs).toBeLessThanOrEqual(Date.now());
      });

      test('normalises the 24:00 end-of-day marker', () => {
        const dt = new DateTime('2026-07-29T24:00:00');

        expect(dt.day).toBe(30);
        expect(dt.hour).toBe(0);
      });

      test('clamps the day to the length of the month', () => {
        expect(new DateTime({ year: 2026, month: 2, day: 31 }).day).toBe(28);
        expect(new DateTime({ year: 2028, month: 2, day: 31 }).day).toBe(29);
      });

      test('rejects malformed and out-of-range input', () => {
        expect(() => new DateTime('29/07/2026')).toThrow(RangeError);
        expect(() => new DateTime('2026-13-01')).toThrow(RangeError);
        expect(() => new DateTime('2026-07-29T25:00')).toThrow(RangeError);
        expect(() => new DateTime('not a date')).toThrow(RangeError);
        expect(() => new DateTime(Number.NaN)).toThrow(RangeError);
        expect(() => new DateTime(new Date('nope'))).toThrow(RangeError);
        expect(
          () => new DateTime('2026-07-29', { timeZone: 'Mars/Olympus' }),
        ).toThrow(RangeError);
        expect(() => new DateTime(true as never)).toThrow(TypeError);
      });

      test('is immutable', () => {
        const dt = new DateTime('2026-07-29');

        expect(Object.isFrozen(dt)).toBe(true);
        expect(dt.add({ days: 1 })).not.toBe(dt);
        expect(dt.day).toBe(29);
      });
    });

    describe('time zones', () => {
      test('reports the offset in force', () => {
        expect(
          new DateTime('2026-07-29T12:00', { timeZone: 'Asia/Kolkata' }).offset,
        ).toBe('+05:30');
        expect(
          new DateTime('2026-07-29T12:00', { timeZone: 'Asia/Kathmandu' })
            .offset,
        ).toBe('+05:45');
        expect(
          new DateTime('2026-07-29T12:00', { timeZone: 'Pacific/Kiritimati' })
            .offset,
        ).toBe('+14:00');
        expect(
          new DateTime('2026-07-29T12:00', { timeZone: 'UTC' }).offset,
        ).toBe('+00:00');
      });

      test('tracks a DST change across the year', () => {
        const zone = 'America/New_York';

        expect(new DateTime('2026-01-15T12:00', { timeZone: zone }).offset).toBe(
          '-05:00',
        );
        expect(new DateTime('2026-07-15T12:00', { timeZone: zone }).offset).toBe(
          '-04:00',
        );
      });

      test('withTimeZone keeps the instant and moves the clock', () => {
        const utc = new DateTime('2026-07-29T12:00:00');
        const moved = utc.withTimeZone('Asia/Kolkata');

        expect(moved.epochMs).toBe(utc.epochMs);
        expect(moved.format('HH:mm')).toBe('17:30');
      });

      test('resolves a DST gap forward by default', () => {
        // 2026-03-08 02:00 EST jumps straight to 03:00 EDT in New York.
        const dt = new DateTime('2026-03-08T02:30:00', {
          timeZone: 'America/New_York',
        });

        expect(dt.hour).toBe(3);
        expect(dt.minute).toBe(30);
        expect(dt.offset).toBe('-04:00');
      });

      test('honours earlier/later/reject across a gap', () => {
        const wall = '2026-03-08T02:30:00';
        const timeZone = 'America/New_York';

        const later = new DateTime(wall, { timeZone, disambiguation: 'later' });
        const earlier = new DateTime(wall, {
          timeZone,
          disambiguation: 'earlier',
        });

        // The wall clocks differ by two hours, but the instants by one.
        expect(earlier.format('HH:mm ZZ')).toBe('01:30 -05:00');
        expect(later.format('HH:mm ZZ')).toBe('03:30 -04:00');
        expect(later.epochMs - earlier.epochMs).toBe(3_600_000);
        expect(
          () => new DateTime(wall, { timeZone, disambiguation: 'reject' }),
        ).toThrow(RangeError);
      });

      test('resolves an ambiguous overlap to the earlier instant', () => {
        // 2026-11-01 01:30 happens twice in New York, at -04:00 then -05:00.
        const wall = '2026-11-01T01:30:00';
        const timeZone = 'America/New_York';

        const compatible = new DateTime(wall, { timeZone });
        const earlier = new DateTime(wall, {
          timeZone,
          disambiguation: 'earlier',
        });
        const later = new DateTime(wall, { timeZone, disambiguation: 'later' });

        expect(compatible.epochMs).toBe(earlier.epochMs);
        expect(later.epochMs - earlier.epochMs).toBe(3_600_000);
        expect(earlier.offset).toBe('-04:00');
        expect(later.offset).toBe('-05:00');
        expect(
          () => new DateTime(wall, { timeZone, disambiguation: 'reject' }),
        ).toThrow(RangeError);
      });

      test('handles a 30-minute DST shift', () => {
        // Lord Howe Island moves between +10:30 and +11:00.
        const zone = 'Australia/Lord_Howe';

        expect(new DateTime('2026-01-15T12:00', { timeZone: zone }).offset).toBe(
          '+11:00',
        );
        expect(new DateTime('2026-07-15T12:00', { timeZone: zone }).offset).toBe(
          '+10:30',
        );
      });
    });

    describe('arithmetic', () => {
      test('adds and subtracts exact units', () => {
        const dt = new DateTime('2026-07-29T12:00:00');

        expect(dt.add({ hours: 3 }).hour).toBe(15);
        expect(dt.subtract({ minutes: 90 }).format('HH:mm')).toBe('10:30');
        expect(dt.add({ milliseconds: 500 }).millisecond).toBe(500);
      });

      test('adds calendar units', () => {
        const dt = new DateTime('2026-07-29T12:00:00');

        expect(dt.add({ days: 3 }).day).toBe(1);
        expect(dt.add({ days: 3 }).month).toBe(8);
        expect(dt.add({ weeks: 1 }).day).toBe(5);
        expect(dt.add({ months: 6 }).format('yyyy-MM-dd')).toBe('2027-01-29');
        expect(dt.add({ years: 1 }).year).toBe(2027);
      });

      test('clamps month overflow', () => {
        const jan31 = new DateTime('2026-01-31');

        expect(jan31.add({ months: 1 }).format('yyyy-MM-dd')).toBe('2026-02-28');
        expect(jan31.add({ months: 13 }).format('yyyy-MM-dd')).toBe(
          '2027-02-28',
        );
        expect(
          new DateTime('2028-01-31').add({ months: 1 }).format('yyyy-MM-dd'),
        ).toBe('2028-02-29');
      });

      test('handles negative month arithmetic across a year boundary', () => {
        expect(
          new DateTime('2026-01-15').subtract({ months: 1 }).format('yyyy-MM'),
        ).toBe('2025-12');
        expect(
          new DateTime('2026-01-15').subtract({ months: 13 }).format('yyyy-MM'),
        ).toBe('2024-12');
      });

      test('keeps the wall clock when adding a day across a DST boundary', () => {
        const before = new DateTime('2026-03-07T12:00:00', {
          timeZone: 'America/New_York',
        });
        const after = before.add({ days: 1 });

        expect(after.format('HH:mm')).toBe('12:00');
        // Same local time, but only 23 real hours later.
        expect(after.epochMs - before.epochMs).toBe(23 * 3_600_000);
      });

      test('keeps the instant when adding exact hours across a DST boundary', () => {
        const before = new DateTime('2026-03-08T00:30:00', {
          timeZone: 'America/New_York',
        });
        const after = before.add({ hours: 24 });

        expect(after.epochMs - before.epochMs).toBe(24 * 3_600_000);
        expect(after.format('HH:mm')).toBe('01:30');
      });

      test('applies calendar units before exact units', () => {
        const dt = new DateTime('2026-07-29T12:00:00');

        expect(
          dt.add({ months: 1, hours: 2 }).format('yyyy-MM-dd HH:mm'),
        ).toBe('2026-08-29 14:00');
      });

      test('rejects fractional calendar units', () => {
        expect(() => new DateTime('2026-07-29').add({ days: 1.5 })).toThrow(
          RangeError,
        );
      });

      test('with replaces fields and clamps', () => {
        const dt = new DateTime('2026-01-31T12:00:00');

        expect(dt.with({ month: 2 }).format('yyyy-MM-dd')).toBe('2026-02-28');
        expect(dt.with({ hour: 6, minute: 15 }).format('HH:mm')).toBe('06:15');
        expect(() => dt.with({ month: 13 })).toThrow(RangeError);
      });
    });

    describe('truncation', () => {
      test('startOf', () => {
        const dt = new DateTime('2026-07-29T14:30:15.250');

        expect(dt.startOf('year').toISOString()).toContain('2026-01-01T00:00');
        expect(dt.startOf('month').toISOString()).toContain('2026-07-01T00:00');
        expect(dt.startOf('day').format('yyyy-MM-dd HH:mm:ss')).toBe(
          '2026-07-29 00:00:00',
        );
        expect(dt.startOf('hour').format('HH:mm:ss')).toBe('14:00:00');
        expect(dt.startOf('minute').format('HH:mm:ss')).toBe('14:30:00');
        expect(dt.startOf('second').format('HH:mm:ss.SSS')).toBe('14:30:15.000');
      });

      test('startOf week lands on Monday', () => {
        // 2026-07-29 is a Wednesday.
        const dt = new DateTime('2026-07-29T14:30:00');

        expect(dt.dayOfWeek).toBe(3);
        expect(dt.startOf('week').format('yyyy-MM-dd EEE')).toBe(
          '2026-07-27 Mon',
        );
      });

      test('endOf returns the last millisecond', () => {
        const dt = new DateTime('2026-07-29T14:30:15.250');

        expect(dt.endOf('day').format('yyyy-MM-dd HH:mm:ss.SSS')).toBe(
          '2026-07-29 23:59:59.999',
        );
        expect(dt.endOf('month').format('yyyy-MM-dd')).toBe('2026-07-31');
        expect(dt.endOf('year').format('yyyy-MM-dd HH:mm')).toBe(
          '2026-12-31 23:59',
        );
      });

      test('endOf day is correct on a 23-hour DST day', () => {
        const dt = new DateTime('2026-03-08T12:00:00', {
          timeZone: 'America/New_York',
        });

        expect(dt.endOf('day').format('HH:mm:ss.SSS')).toBe('23:59:59.999');
      });

      test('rejects an unknown unit', () => {
        expect(() =>
          new DateTime('2026-07-29').startOf('fortnight' as never),
        ).toThrow(RangeError);
      });
    });

    describe('comparison', () => {
      const early = new DateTime('2026-07-29T10:00:00');
      const late = new DateTime('2026-07-29T18:00:00');

      test('compare, isBefore, isAfter, isBetween', () => {
        expect(early.compare(late)).toBe(-1);
        expect(late.compare(early)).toBe(1);
        expect(early.compare(new DateTime(early))).toBe(0);
        expect(early.isBefore(late)).toBe(true);
        expect(late.isAfter(early)).toBe(true);
        expect(
          new DateTime('2026-07-29T12:00:00').isBetween(early, late),
        ).toBe(true);
        expect(early.isBetween(early, late)).toBe(true);
      });

      test('equals compares instant and zone', () => {
        const utc = new DateTime('2026-07-29T12:00:00');
        const elsewhere = utc.withTimeZone('Asia/Kolkata');

        expect(utc.equals(new DateTime(utc))).toBe(true);
        expect(utc.equals(elsewhere)).toBe(false);
        expect(utc.compare(elsewhere)).toBe(0);
      });

      test('sorts with the static comparator', () => {
        const sorted = [late, early].sort(DateTime.compare);

        expect(sorted[0].epochMs).toBe(early.epochMs);
      });

      test('diff in exact units is fractional elapsed time', () => {
        expect(late.diff(early, 'hour')).toBe(8);
        expect(early.diff(late, 'hour')).toBe(-8);
        expect(late.diff(early, 'minute')).toBe(480);
        expect(
          new DateTime('2026-07-29T10:30:00').diff(early, 'hour'),
        ).toBe(0.5);
      });

      test('diff in calendar units counts whole units', () => {
        const a = new DateTime('2026-01-31');
        const b = new DateTime('2026-03-31');

        expect(b.diff(a, 'month')).toBe(2);
        expect(a.diff(b, 'month')).toBe(-2);
        expect(new DateTime('2026-03-30').diff(a, 'month')).toBe(1);
        expect(new DateTime('2027-07-29').diff(new DateTime('2026-07-29'), 'year')).toBe(1);
        expect(new DateTime('2027-07-28').diff(new DateTime('2026-07-29'), 'year')).toBe(0);
        expect(new DateTime('2026-08-12').diff(new DateTime('2026-07-29'), 'week')).toBe(2);
        expect(new DateTime('2026-08-01').diff(new DateTime('2026-07-29'), 'day')).toBe(3);
      });

      test('diff in days counts wall-clock days across a DST boundary', () => {
        const timeZone = 'America/New_York';
        const a = new DateTime('2026-03-07T12:00:00', { timeZone });
        const b = new DateTime('2026-03-08T12:00:00', { timeZone });

        expect(b.diff(a, 'day')).toBe(1);
      });

      test('rejects a non-DateTime operand', () => {
        expect(() => early.diff('2026-07-29' as never, 'day')).toThrow(
          TypeError,
        );
        expect(() => early.compare(null as never)).toThrow(TypeError);
        expect(early.equals(null as never)).toBe(false);
      });
    });

    describe('calendar fields', () => {
      test('day of week, day of year and leap years', () => {
        const dt = new DateTime('2026-07-29');

        expect(dt.dayOfWeek).toBe(3);
        expect(dt.dayOfYear).toBe(210);
        expect(dt.daysInMonth).toBe(31);
        expect(dt.daysInYear).toBe(365);
        expect(dt.inLeapYear).toBe(false);

        expect(new DateTime('2028-02-01').daysInMonth).toBe(29);
        expect(new DateTime('2028-01-01').inLeapYear).toBe(true);
        expect(new DateTime('2100-01-01').inLeapYear).toBe(false);
        expect(new DateTime('2000-01-01').inLeapYear).toBe(true);
      });

      test('ISO week numbering', () => {
        expect(new DateTime('2026-01-01').weekOfYear).toBe(1);
        expect(new DateTime('2026-07-29').weekOfYear).toBe(31);

        // 2027-01-01 is a Friday, so it belongs to week 53 of 2026.
        const edge = new DateTime('2027-01-01');

        expect(edge.weekOfYear).toBe(53);
        expect(edge.weekYear).toBe(2026);
        expect(edge.year).toBe(2027);
      });
    });

    describe('formatting', () => {
      const dt = new DateTime('2026-07-29T14:30:15.250', {
        timeZone: 'Asia/Kolkata',
      });

      test('renders every token', () => {
        expect(dt.format('yyyy-MM-dd')).toBe('2026-07-29');
        expect(dt.format('yy/M/d')).toBe('26/7/29');
        expect(dt.format('HH:mm:ss.SSS')).toBe('14:30:15.250');
        expect(dt.format('h:mm a')).toBe('2:30 PM');
        expect(dt.format('MMMM')).toBe('July');
        expect(dt.format('MMM')).toBe('Jul');
        expect(dt.format('EEEE')).toBe('Wednesday');
        expect(dt.format('EEE')).toBe('Wed');
        expect(dt.format('DDD')).toBe('210');
        expect(dt.format('ww')).toBe('31');
        expect(dt.format('ZZ')).toBe('+05:30');
        expect(dt.format('Z')).toBe('+0530');
        expect(dt.format('zzz')).toBe('Asia/Kolkata');
      });

      test('emits quoted text literally', () => {
        expect(dt.format("yyyy-MM-dd'T'HH:mm")).toBe('2026-07-29T14:30');
        expect(dt.format("'on' EEEE")).toBe('on Wednesday');
      });

      test('localises names only', () => {
        expect(dt.format('MMMM', 'fr-FR')).toBe('juillet');
        expect(dt.format('yyyy-MM-dd', 'fr-FR')).toBe('2026-07-29');
      });

      test('midnight formats as 12 AM in the 12-hour clock', () => {
        const midnight = new DateTime('2026-07-29T00:15:00');

        expect(midnight.format('h:mm a')).toBe('12:15 AM');
        expect(midnight.format('HH:mm')).toBe('00:15');
      });

      test('rejects a non-string pattern', () => {
        expect(() => dt.format(42 as never)).toThrow(TypeError);
      });

      test('toISOString round-trips exactly', () => {
        const iso = dt.toISOString();

        expect(iso).toBe('2026-07-29T14:30:15.250+05:30[Asia/Kolkata]');
        expect(new DateTime(iso).epochMs).toBe(dt.epochMs);
        expect(new DateTime(iso).timeZone).toBe('Asia/Kolkata');
      });

      test('serialises through JSON', () => {
        expect(JSON.parse(JSON.stringify({ at: dt })).at).toBe(
          dt.toISOString(),
        );
      });

      test('interoperates with Date and numeric coercion', () => {
        expect(dt.toDate().getTime()).toBe(dt.epochMs);
        expect(Number(dt)).toBe(dt.epochMs);
        expect(new DateTime('2026-07-29') < new DateTime('2026-07-30')).toBe(
          true,
        );
      });

      test('toLocaleString respects the zone', () => {
        const output = dt.toLocaleString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        expect(output).toContain('July');
        expect(output).toContain('2026');
      });
    });
  });
}

describe('DateTime backend selection', () => {
  afterEach(() => {
    DateTime._setBackend(null);
  });

  test('picks a backend automatically', () => {
    expect(DateTime._backend()).toBe(DateTime.hasTemporal ? 'temporal' : 'intl');
  });

  test('Temporal interop throws where Temporal is absent', () => {
    if (DateTime.hasTemporal) {
      const dt = new DateTime('2026-07-29T12:00:00', {
        timeZone: 'Asia/Kolkata',
      });
      const round = DateTime.fromTemporal(
        dt.toTemporal() as { epochMilliseconds: number; timeZoneId?: string },
      );

      expect(round.epochMs).toBe(dt.epochMs);

      // The zone must survive the round trip, but not necessarily under the
      // same spelling: older Temporal revisions report the ICU alias
      // `Asia/Calcutta` for `Asia/Kolkata`. Compare what the zone *does*.
      expect(round.offsetMs).toBe(dt.offsetMs);
      expect(round.format('yyyy-MM-dd HH:mm')).toBe(
        dt.format('yyyy-MM-dd HH:mm'),
      );
    } else {
      expect(() => new DateTime('2026-07-29').toTemporal()).toThrow();
      expect(() => DateTime.fromTemporal({ epochMilliseconds: 0 })).toThrow();
    }
  });
});

/**
 * The differential check: the `Intl` backend re-implements offset resolution by
 * hand, so on runtimes that also have Temporal both must produce identical
 * results. This is what catches a divergence in the hand-rolled path.
 */
if (DateTime.hasTemporal) {
  describe('DateTime backend equivalence', () => {
    afterEach(() => {
      DateTime._setBackend(null);
    });

    const zones = [
      'UTC',
      'America/New_York',
      'America/Santiago',
      'Europe/London',
      'Europe/Dublin',
      'Asia/Kolkata',
      'Asia/Kathmandu',
      'Asia/Tehran',
      'Australia/Lord_Howe',
      'Pacific/Kiritimati',
      'Pacific/Chatham',
    ];

    const walls = [
      '2026-01-01T00:00:00',
      '2026-03-08T01:30:00',
      '2026-03-08T02:30:00',
      '2026-03-08T03:30:00',
      '2026-06-15T12:00:00',
      '2026-09-27T02:30:00',
      '2026-11-01T01:30:00',
      '2026-12-31T23:59:59.999',
      '2000-02-29T12:00:00',
      '1970-01-01T00:00:00',
      '1969-07-20T20:17:40',
    ];

    const render = (dt: DateTime) =>
      `${dt.epochMs}|${dt.toISOString()}|${dt.dayOfWeek}|${dt.offsetMs}`;

    test('both backends resolve wall-clock times identically', () => {
      for (const timeZone of zones) {
        for (const wall of walls) {
          for (const disambiguation of ['compatible', 'earlier', 'later'] as const) {
            DateTime._setBackend('intl');
            const intl = render(
              new DateTime(wall, { timeZone, disambiguation }),
            );

            DateTime._setBackend('temporal');
            const temporal = render(
              new DateTime(wall, { timeZone, disambiguation }),
            );

            expect(`${timeZone} ${wall} ${disambiguation} ${intl}`).toBe(
              `${timeZone} ${wall} ${disambiguation} ${temporal}`,
            );
          }
        }
      }
    });

    test('both backends read instants identically', () => {
      const instants = [
        0,
        -86_400_000,
        Date.UTC(2026, 2, 8, 6, 59, 59, 999),
        Date.UTC(2026, 2, 8, 7, 0, 0),
        Date.UTC(2026, 10, 1, 5, 30),
        Date.UTC(1900, 0, 1),
        Date.UTC(2038, 0, 19, 3, 14, 8),
      ];

      for (const timeZone of zones) {
        for (const epochMs of instants) {
          DateTime._setBackend('intl');
          const intl = render(new DateTime(epochMs, { timeZone }));

          DateTime._setBackend('temporal');
          const temporal = render(new DateTime(epochMs, { timeZone }));

          expect(`${timeZone} ${epochMs} ${intl}`).toBe(
            `${timeZone} ${epochMs} ${temporal}`,
          );
        }
      }
    });

    test('both backends agree on arithmetic across transitions', () => {
      for (const timeZone of zones) {
        const start = '2026-03-07T12:00:00';

        for (const duration of [
          { days: 1 },
          { days: 30 },
          { months: 1 },
          { months: -1 },
          { years: 1 },
          { weeks: 2 },
          { hours: 24 },
        ]) {
          DateTime._setBackend('intl');
          const intl = render(
            new DateTime(start, { timeZone }).add(duration),
          );

          DateTime._setBackend('temporal');
          const temporal = render(
            new DateTime(start, { timeZone }).add(duration),
          );

          expect(`${timeZone} ${JSON.stringify(duration)} ${intl}`).toBe(
            `${timeZone} ${JSON.stringify(duration)} ${temporal}`,
          );
        }
      }
    });
  });
}
