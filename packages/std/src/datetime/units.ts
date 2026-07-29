import type { DateTimeUnit, DurationLike } from './types';

/** Milliseconds in each exact unit. Calendar units are absent by design: they
 * have no fixed length, so anything indexing this must fall back to calendar
 * arithmetic when it finds nothing. */
export const MS: Record<string, number> = {
  hour: 3_600_000,
  minute: 60_000,
  second: 1000,
  millisecond: 1,
};

export const DAY_MS = 86_400_000;

/** The singular unit name to its plural `DurationLike` key. */
export const PLURAL: Record<DateTimeUnit, keyof DurationLike> = {
  year: 'years',
  month: 'months',
  week: 'weeks',
  day: 'days',
  hour: 'hours',
  minute: 'minutes',
  second: 'seconds',
  millisecond: 'milliseconds',
};

/** Largest to smallest. Order is load-bearing: balancing walks it downward. */
export const UNITS = Object.keys(PLURAL) as DateTimeUnit[];

/** The `DurationLike` keys, in the same order. */
export const DURATION_KEYS = UNITS.map(
  (unit) => PLURAL[unit],
) as (keyof DurationLike)[];

/** Whether a unit has a fixed length, and so needs no reference point. */
export function isExact(unit: DateTimeUnit): boolean {
  return MS[unit] !== undefined;
}

export function assertUnit(unit: DateTimeUnit): void {
  if (!UNITS.includes(unit)) {
    throw new RangeError(
      `The unit must be one of ${UNITS.join(', ')}. Received: ${unit}`,
    );
  }
}
