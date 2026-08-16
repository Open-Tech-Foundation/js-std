/**
 * How deep the recursive walkers will go before giving up.
 *
 * `JSON.parse` accepts nesting far deeper than a recursive walk over the
 * result can follow, so a 20,000-deep object parsed from untrusted input made
 * `merge`, `clone`, `isEql` and `deepFreeze` overflow the stack. A
 * `RangeError` either way, but the depth it happened at was a property of the
 * runtime and of how much stack the caller had already used, so the same input
 * could pass in one place and fail in another.
 *
 * The limit is far past any structure meant for a human or a schema, and makes
 * the failure the same everywhere it happens.
 */
export const MAX_DEPTH = 512;

/** Throws once a walk has gone deeper than {@link MAX_DEPTH}. */
export function checkDepth(depth: number, name: string): void {
  if (depth > MAX_DEPTH) {
    throw new RangeError(
      `${name}: input nested deeper than ${MAX_DEPTH} levels.`,
    );
  }
}
