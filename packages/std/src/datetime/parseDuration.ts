import type { DurationLike } from './types';
import { MS } from './units';

/**
 * ISO-8601 durations: `PnYnMnWnDTnHnMnS`, with an optional leading sign.
 *
 * Deliberately strict, for the same reason `parseISO` is — a duration read off
 * the wire is worth rejecting rather than guessing at. Date components are
 * integers only: a fraction of a year or a month has no fixed length, so
 * `P1.5Y` is not something this can resolve without a reference point. Time
 * components may carry a fraction, which ISO allows on the smallest present
 * component alone.
 */
const ISO_DURATION =
  /^([+-])?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+(?:[.,]\d+)?)H)?(?:(\d+(?:[.,]\d+)?)M)?(?:(\d+(?:[.,]\d+)?)S)?)?$/;

function hasFraction(token: string | undefined): boolean {
  return token !== undefined && /[.,]/.test(token);
}

function whole(token: string | undefined): number {
  return token === undefined ? 0 : Number.parseInt(token, 10);
}

/** The fractional part of a time component, in milliseconds. */
function fractionMs(token: string | undefined, unitMs: number): number {
  if (!hasFraction(token)) {
    return 0;
  }

  const digits = (token as string).replace(',', '.').split('.')[1];

  return Math.round(Number.parseFloat(`0.${digits}`) * unitMs);
}

/**
 * Parses an ISO-8601 duration into duration fields.
 *
 * A fraction on the smallest present time component cascades into the smaller
 * units, so `PT1.5H` yields one hour and thirty minutes rather than a
 * fractional hour — every field a `Duration` holds is an integer.
 *
 * @param {string} input The ISO-8601 duration string.
 * @returns {Required<DurationLike>} The parsed fields, signed.
 *
 * @throws {RangeError} When the string is malformed, carries no components, or
 *   places a fraction anywhere but the smallest present component.
 */
export default function parseDuration(input: string): Required<DurationLike> {
  const match = ISO_DURATION.exec(input.trim());

  if (!match) {
    throw new RangeError(`Invalid ISO 8601 duration: ${input}`);
  }

  const [, sign, years, months, weeks, days, hours, minutes, seconds] = match;
  const date = [years, months, weeks, days];
  const time = [hours, minutes, seconds];

  if ([...date, ...time].every((part) => part === undefined)) {
    throw new RangeError(
      `An ISO 8601 duration needs at least one component: ${input}`,
    );
  }

  // `P1DT` parses to a match with every time group empty, but a `T` with
  // nothing after it is not a duration.
  if (input.includes('T') && time.every((part) => part === undefined)) {
    throw new RangeError(
      `The time part of an ISO 8601 duration is empty: ${input}`,
    );
  }

  if (
    (hasFraction(hours) && (minutes !== undefined || seconds !== undefined)) ||
    (hasFraction(minutes) && seconds !== undefined)
  ) {
    throw new RangeError(
      `Only the smallest component of an ISO 8601 duration may carry a fraction: ${input}`,
    );
  }

  // At most one fraction survives the check above, so these sum to a single
  // remainder rather than compounding.
  let rest =
    fractionMs(hours, MS.hour) +
    fractionMs(minutes, MS.minute) +
    fractionMs(seconds, MS.second);

  const fields = {
    years: whole(years),
    months: whole(months),
    weeks: whole(weeks),
    days: whole(days),
    hours: whole(hours),
    minutes: whole(minutes),
    seconds: whole(seconds),
    milliseconds: 0,
  };

  // The fraction was on the smallest present component, so everything it
  // cascades into is still zero and this assigns rather than accumulates.
  fields.minutes += Math.trunc(rest / MS.minute);
  rest %= MS.minute;
  fields.seconds += Math.trunc(rest / MS.second);
  fields.milliseconds = rest % MS.second;

  if (sign !== '-') {
    return fields;
  }

  for (const key of Object.keys(fields) as (keyof DurationLike)[]) {
    // `-0` would compare equal to zero but serialise back with a sign, so the
    // zero fields are left alone.
    if (fields[key] !== 0) {
      fields[key] = -(fields[key] as number);
    }
  }

  return fields;
}
