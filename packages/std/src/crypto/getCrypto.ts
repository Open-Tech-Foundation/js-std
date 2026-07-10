type NodeCryptoModule = {
  randomUUID?: () => string;
  webcrypto?: Crypto;
};

let cachedNodeCryptoModule: NodeCryptoModule | null | undefined;

function getNodeCryptoModule(): NodeCryptoModule | undefined {
  if (cachedNodeCryptoModule !== undefined) {
    return cachedNodeCryptoModule ?? undefined;
  }

  const processObj = globalThis.process as
    | { getBuiltinModule?: (id: string) => unknown }
    | undefined;

  if (typeof processObj?.getBuiltinModule === 'function') {
    try {
      const mod = processObj.getBuiltinModule('node:crypto') as
        | NodeCryptoModule
        | undefined;
      cachedNodeCryptoModule = mod ?? null;
      return mod;
    } catch {
      // Ignore missing built-in module support and continue.
    }
  }

  try {
    const req = Function(
      'return typeof require === "function" ? require : undefined;',
    )() as ((id: string) => unknown) | undefined;

    if (req) {
      const mod = req('node:crypto') as NodeCryptoModule;
      cachedNodeCryptoModule = mod;
      return mod;
    }
  } catch {
    // Ignore environments without CommonJS require.
  }

  cachedNodeCryptoModule = null;
  return undefined;
}

export function getCrypto(): Crypto {
  if (globalThis.crypto) {
    return globalThis.crypto;
  }

  const nodeCrypto = getNodeCryptoModule();
  if (nodeCrypto?.webcrypto) {
    return nodeCrypto.webcrypto;
  }

  throw new Error('Crypto helpers require Web Crypto or node:crypto support.');
}

export function randomUUIDv4(): string {
  const crypto = getCrypto();

  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const nodeCrypto = getNodeCryptoModule();
  if (typeof nodeCrypto?.randomUUID === 'function') {
    return nodeCrypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));

  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex
    .slice(6, 8)
    .join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}
