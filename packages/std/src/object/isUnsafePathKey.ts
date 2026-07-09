export default function isUnsafePathKey(key: unknown): boolean {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
}
