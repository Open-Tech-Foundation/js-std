import encodeBase64 from './encodeBase64';

export interface EncodeBase64UrlOptions {
  /** Keep the trailing `=` padding. Defaults to `true`. */
  pad?: boolean;
}

/**
 * Encodes bytes to a URL-safe Base64 string.
 *
 * @example
 * encodeBase64Url(new Uint8Array([104, 101, 108, 108, 111]), { pad: false })
 * //=> 'aGVsbG8'
 */
export default function encodeBase64Url(
  bytes: Uint8Array | ArrayBuffer,
  options: EncodeBase64UrlOptions = {},
): string {
  const { pad = true } = options;
  const encoded = encodeBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_');

  return pad ? encoded : encoded.replace(/=+$/, '');
}
