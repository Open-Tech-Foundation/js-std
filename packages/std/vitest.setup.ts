import { vi } from 'vitest';
import crypto from 'node:crypto';

// WebCrypto Polyfill for Node 18
if (typeof window === 'undefined' && typeof globalThis.crypto === 'undefined') {
  try {
    const webcrypto = (crypto as any).webcrypto;
    if (webcrypto) {
      Object.defineProperty(globalThis, 'crypto', {
        value: webcrypto,
        writable: true,
        configurable: true,
      });
    }
  } catch (err) {
    // Crypto disabled
  }
}

// Polyfill modern Vitest Async Timer APIs for older environments (Node 18 / Bun)
if (typeof vi !== 'undefined') {
  if (!vi.advanceTimersByTimeAsync) {
    vi.advanceTimersByTimeAsync = async (ms: number) => {
      vi.advanceTimersByTime(ms);
      await Promise.resolve();
    };
  }
}
