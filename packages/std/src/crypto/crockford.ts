/**
 * Crockford's Base32: the digits and upper-case letters, less I, L, O and U —
 * the four that are misread as 1, 1, 0 and V when a human copies an ID down.
 */
export const CROCKFORD_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * A canonical ULID: 26 characters of the alphabet above.
 *
 * The first character is capped at `7` because the timestamp is 48 bits and
 * ten Base32 characters hold 50 — anything above `7ZZZZZZZZZ` would overflow
 * it, so such a string is not a ULID however well-formed it looks.
 *
 * Case-insensitive: the canonical form is upper case, but systems that
 * lower-case their identifiers are common enough that rejecting them would be
 * unhelpful. The I/L/O substitutions Crockford allows a *decoder* to make are
 * deliberately not accepted, since a string carrying them is not one this
 * module produced.
 */
export const ULID_REGEX = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/i;
