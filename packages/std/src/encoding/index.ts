/**
 * Encodes a string to Base64 format.
 */
export function base64Encode(str: string): string {
  const bytes = new TextEncoder().encode(str);

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a Base64 string.
 */
export function base64Decode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Encodes a string to Hex format.
 */
export function hexEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('hex');
  }

  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Decodes a Hex string.
 */
export function hexDecode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'hex').toString('utf-8');
  }

  const bytes = new Uint8Array(
    str.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  return new TextDecoder().decode(bytes);
}
