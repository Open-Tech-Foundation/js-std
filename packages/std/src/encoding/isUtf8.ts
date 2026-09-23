/**
 * Checks whether bytes contain a complete, valid UTF-8 sequence.
 *
 * @param {Uint8Array | ArrayBuffer} input The bytes to validate.
 * @returns {boolean} `true` when every byte belongs to a valid UTF-8 sequence.
 * @throws {TypeError} If the input is not a `Uint8Array` or `ArrayBuffer`.
 *
 * @example
 * isUtf8(new Uint8Array([0x48, 0x69])) //=> true
 * isUtf8(new Uint8Array([0xc3, 0x28])) //=> false
 */

export default function isUtf8(input: Uint8Array | ArrayBuffer): boolean {
  let bytes: Uint8Array;

  if (input instanceof Uint8Array) {
    bytes = input;
  } else if (input instanceof ArrayBuffer) {
    try {
      bytes = new Uint8Array(input);
    } catch {
      // A detached ArrayBuffer has no bytes to read, so it validates as
      // empty. Recent Node versions throw `ERR_INVALID_STATE` here instead.
      return true;
    }
  } else {
    throw new TypeError('Expected a Uint8Array or ArrayBuffer to validate.');
  }

  for (let index = 0; index < bytes.length; index++) {
    const first = bytes[index];

    if (first <= 0x7f) continue;

    if (first >= 0xc2 && first <= 0xdf) {
      if (index + 1 >= bytes.length || !isContinuationByte(bytes[++index])) {
        return false;
      }
      continue;
    }

    if (first >= 0xe0 && first <= 0xef) {
      if (index + 2 >= bytes.length) return false;

      const second = bytes[++index];
      const third = bytes[++index];
      if (
        !isContinuationByte(second) ||
        !isContinuationByte(third) ||
        (first === 0xe0 && second < 0xa0) ||
        (first === 0xed && second > 0x9f)
      ) {
        return false;
      }
      continue;
    }

    if (first >= 0xf0 && first <= 0xf4) {
      if (index + 3 >= bytes.length) return false;

      const second = bytes[++index];
      const third = bytes[++index];
      const fourth = bytes[++index];
      if (
        !isContinuationByte(second) ||
        !isContinuationByte(third) ||
        !isContinuationByte(fourth) ||
        (first === 0xf0 && second < 0x90) ||
        (first === 0xf4 && second > 0x8f)
      ) {
        return false;
      }
      continue;
    }

    return false;
  }

  return true;
}

function isContinuationByte(byte: number): boolean {
  return byte >= 0x80 && byte <= 0xbf;
}
