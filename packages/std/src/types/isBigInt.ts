/**
 * Checks if the given value is a BigInt.
 *
 * @example
 *
 * isBigInt(1) //=> false
 *
 * isBigInt(1n) //=> true
 *
 */

export default function isBigInt(val: unknown): val is bigint {
  return typeof val === 'bigint';
}
