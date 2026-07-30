// Version 1 to 8 per RFC 9562, and the `10xx` variant bits the same document
// requires, which is what confines the third group's first character to 8, 9,
// a or b. A generic 8-4-4-4-12 hex test would pass strings no generator emits.
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// The two special forms RFC 9562 names. Neither carries a version or variant,
// so neither can match a version filter.
const NIL_UUID = '00000000-0000-0000-0000-000000000000';
const MAX_UUID = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

const VERSION_INDEX = 14;

/**
 * Checks whether a value is a UUID.
 *
 * The counterpart to `uuidv4` and `uuidv7`, and the more common operation of
 * the two: an identifier arriving from a route parameter, a form or another
 * service has to be checked before it is trusted, and a bare `8-4-4-4-12` hex
 * test is not that check. It admits strings no generator produces, because it
 * ignores the version and variant bits the format actually reserves.
 *
 * Versions 1 to 8 are recognised, following RFC 9562 rather than the older
 * RFC 4122 — this module emits version 7, which RFC 4122 has no concept of, so
 * the narrower rule would reject its own output. The Nil and Max UUIDs are
 * accepted as the two special forms that document defines; neither carries a
 * version, so neither satisfies a `version` filter.
 *
 * Case-insensitive, as the specification requires. Hyphens must be present and
 * in place: a bare 32-character hex string is not a UUID.
 *
 * @param {unknown} val The value to check.
 * @param {number} [version] Require this exact version, 1 to 8.
 * @returns {boolean} True if the value is a UUID.
 * @throws {RangeError} If `version` is given and is not an integer from 1 to 8.
 *
 * @example
 * isUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479') //=> true
 * isUUID('not-a-uuid') //=> false
 * isUUID(42) //=> false
 *
 * @example
 * isUUID(uuidv7(), 7) //=> true
 * isUUID(uuidv4(), 7) //=> false
 *
 * @example
 * isUUID('00000000-0000-0000-0000-000000000000') //=> true  the Nil UUID
 * isUUID('00000000-0000-0000-0000-000000000000', 4) //=> false
 */
export default function isUUID(val: unknown, version?: number): val is string {
  if (version !== undefined) {
    if (!Number.isInteger(version) || version < 1 || version > 8) {
      throw new RangeError('The version must be an integer between 1 and 8.');
    }
  }

  if (typeof val !== 'string') {
    return false;
  }

  if (!UUID_REGEX.test(val)) {
    // Nil and Max have no version, so they only pass the unfiltered check.
    if (version !== undefined) {
      return false;
    }

    const lower = val.toLowerCase();

    return lower === NIL_UUID || lower === MAX_UUID;
  }

  if (version === undefined) {
    return true;
  }

  return Number.parseInt(val[VERSION_INDEX], 16) === version;
}
