import encodeBase64 from './encodeBase64';

/**
 * Encodes bytes to a URL-safe Base64 string.
 *
 * @example
 * encodeBase64Url(new Uint8Array([104, 101, 108, 108, 111]), { pad: false })
 * //=> 'aGVsbG8'
 */
export default function encodeBase64Url(
  bytes: Uint8Array | ArrayBuffer,
  options: { pad?: boolean } = {},
): string {
  const { pad = true } = options;
  const encoded = encodeBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_');

  return pad ? encoded : encoded.replace(/=+$/, '');
}
