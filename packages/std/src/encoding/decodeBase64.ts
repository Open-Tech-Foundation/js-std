const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const BASE64_LOOKUP = new Map(
  Array.from(BASE64_ALPHABET, (char, index) => [char, index]),
);

/**
 * Decodes a Base64 string to bytes.
 *
 * @example
 * decodeBase64('SGVsbG8=') //=> Uint8Array [72, 101, 108, 108, 111]
 */
export default function decodeBase64(str: string): Uint8Array {
  let input = str.replace(/\s/g, '');

  if (input.length % 4 === 1) {
    throw new Error('Invalid Base64 string.');
  }

  while (input.length % 4 !== 0) {
    input += '=';
  }

  const padding = input.endsWith('==') ? 2 : input.endsWith('=') ? 1 : 0;
  const out = new Uint8Array((input.length / 4) * 3 - padding);
  let outIndex = 0;

  for (let i = 0; i < input.length; i += 4) {
    const chunk = input.slice(i, i + 4);
    const values = Array.from(chunk, (char, index) => {
      if (char === '=') {
        if (i + index < input.length - padding) {
          throw new Error('Invalid Base64 padding.');
        }
        return 0;
      }

      const value = BASE64_LOOKUP.get(char);
      if (value === undefined) {
        throw new Error('Invalid Base64 character.');
      }
      return value;
    });

    const triple =
      (values[0] << 18) | (values[1] << 12) | (values[2] << 6) | values[3];

    if (outIndex < out.length) out[outIndex++] = (triple >> 16) & 0xff;
    if (outIndex < out.length) out[outIndex++] = (triple >> 8) & 0xff;
    if (outIndex < out.length) out[outIndex++] = triple & 0xff;
  }

  return out;
}
