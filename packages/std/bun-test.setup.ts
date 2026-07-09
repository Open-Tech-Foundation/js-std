import { vi } from 'bun:test';
import crypto from 'node:crypto';

// WebCrypto polyfill for runtimes that expose Node crypto but not global crypto.
if (typeof globalThis.crypto === 'undefined') {
  try {
    const webcrypto = (crypto as any).webcrypto;
    if (webcrypto) {
      Object.defineProperty(globalThis, 'crypto', {
        value: webcrypto,
        writable: true,
        configurable: true,
      });
    }
  } catch {
    // Crypto disabled.
  }
}

if (!vi.advanceTimersByTimeAsync) {
  vi.advanceTimersByTimeAsync = async (ms: number) => {
    vi.advanceTimersByTime(ms);
    await Promise.resolve();
  };
}
