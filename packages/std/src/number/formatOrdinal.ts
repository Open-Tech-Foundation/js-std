/**
 * Formats a number to its ordinal form (1st, 2nd, 3rd, etc.).
 *
 * @param {number} n The number to format.
 * @returns {string} The ordinal formatted string.
 *
 * @example
 * formatOrdinal(1) //=> '1st'
 * formatOrdinal(2) //=> '2nd'
 * formatOrdinal(3) //=> '3rd'
 * formatOrdinal(11) //=> '11th'
 * formatOrdinal(21) //=> '21st'
 */

export default function formatOrdinal(n: number): string {
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    return String(n);
  }

  const abs = Math.abs(n);
  const mod100 = abs % 100;
  const mod10 = abs % 10;

  if (mod100 >= 11 && mod100 <= 13) {
    return `${n}th`;
  }

  switch (mod10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
