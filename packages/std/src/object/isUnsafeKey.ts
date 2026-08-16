/**
 * Reports whether a key is unsafe to write to an object.
 *
 * Writing any of these reaches the prototype rather than the object itself:
 * `__proto__` goes through the accessor on `Object.prototype` and replaces the
 * object's prototype outright, and `constructor`/`prototype` are the path from
 * an object back to `Object.prototype` that a second write would then follow.
 *
 * Every function in this library that writes a key it did not choose itself —
 * a path segment, a key copied from a source object, a key derived from a
 * value — has to ask this first. Keep the check here rather than inline, so
 * that a new function is a single missing import rather than a silently
 * forgotten condition.
 *
 * Symbols are always safe: they cannot name any of these.
 */
export default function isUnsafeKey(key: unknown): boolean {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
}

/**
 * Reports whether any segment of a path is unsafe to write.
 *
 * The path mutators ask this before they touch anything. Checking segment by
 * segment as the walk goes would refuse the unsafe write correctly, but only
 * after the branch leading up to it had already been created — leaving the
 * caller a half-built path it never asked for. A path that will be refused is
 * better refused whole.
 */
export function hasUnsafeKey(path: readonly unknown[]): boolean {
  return path.some(isUnsafeKey);
}
