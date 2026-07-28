import stringToBytes from '../encoding/stringToBytes';

type Bytes = string | ArrayBuffer | ArrayBufferView;

function toBytes(value: Bytes): Uint8Array {
  if (typeof value === 'string') {
    return stringToBytes(value);
  }

  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }

  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }

  throw new TypeError(
    'Expected a string, ArrayBuffer or ArrayBufferView to compare.',
  );
}

/**
 * Compares two values in constant time, so the comparison leaks no information
 * about *where* they differ.
 *
 * Use it instead of `===` whenever one side is a secret — an HMAC digest, an API
 * key, a session token or a password hash. A plain `===` returns as soon as it
 * hits the first differing byte, and that timing difference lets an attacker
 * recover the expected value one byte at a time.
 *
 * Strings are compared by their UTF-8 bytes. The comparison always scans the
 * longer of the two inputs, so the running time reveals nothing beyond the
 * input lengths, which are not secret for digests of a fixed size.
 *
 * @param {string | ArrayBuffer | ArrayBufferView} a The first value.
 * @param {string | ArrayBuffer | ArrayBufferView} b The second value.
 * @returns {boolean} `true` when both values hold the same bytes.
 *
 * @example
 * const expected = await hmacSHA256(secret, payload);
 * timingSafeEqual(expected, receivedSignature) //=> true
 */
export default function timingSafeEqual(a: Bytes, b: Bytes): boolean {
  const x = toBytes(a);
  const y = toBytes(b);

  const length = Math.max(x.length, y.length);

  // Seeded with the length difference so unequal lengths can never compare
  // equal, and looped over the longer input so there is no early exit.
  let diff = x.length ^ y.length;

  for (let i = 0; i < length; i++) {
    diff |= (i < x.length ? x[i] : 0) ^ (i < y.length ? y[i] : 0);
  }

  return diff === 0;
}
