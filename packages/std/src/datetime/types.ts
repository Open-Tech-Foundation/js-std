/** The units `DateTime` can be truncated to, advanced by and compared in. */
export type DateTimeUnit =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';

/**
 * How to resolve a wall-clock time that a DST transition made ambiguous or
 * non-existent.
 *
 * - `compatible` — a gap resolves forward, an overlap takes the earlier offset.
 * - `earlier` / `later` — always take that side of the transition.
 * - `reject` — throw a `RangeError`.
 */
export type Disambiguation = 'compatible' | 'earlier' | 'later' | 'reject';

/** A wall-clock reading, with a 1-based month and day. */
export interface DateTimeFields {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}

/** A shift in calendar and/or exact units. Values may be negative. */
export interface DurationLike {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export interface DateTimeOptions {
  /** IANA time zone id. Defaults to `'UTC'`. */
  timeZone?: string;
  /** Defaults to `'compatible'`. */
  disambiguation?: Disambiguation;
}

/**
 * Where to anchor a duration that carries calendar units.
 *
 * A year, month, week or day has no fixed length, so converting or comparing
 * one needs a point on the calendar to measure from. Durations made only of
 * hours and below never need this.
 */
export interface RelativeToOptions {
  relativeTo?: import('./DateTime').default;
}

/** Options for `Duration.between`. */
export interface DurationBetweenOptions {
  /** The coarsest unit to express the result in. Defaults to `'day'`. */
  largestUnit?: DateTimeUnit;
}

/**
 * A fully resolved wall-clock reading in a specific zone, plus the offset that
 * was in force at that instant. This is the value both civil backends produce.
 */
export interface CivilFields {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  /** Offset from UTC in milliseconds, e.g. `19800000` for `+05:30`. */
  offsetMs: number;
  /** 1 = Monday … 7 = Sunday, per ISO-8601. */
  dayOfWeek: number;
}
