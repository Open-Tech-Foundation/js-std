import isEql from '../assert/isEql';

/**
 * Creates the "have I had this one before?" test the `unique` family shares.
 *
 * Primitive keys go in a `Set`, so they are matched by identity — `NaN` equals
 * `NaN` and `-0` equals `0` — and cost nothing to look up. Object keys are
 * compared structurally with `isEql` against every distinct object held so
 * far, which is quadratic in the number of them but is the only way to treat
 * two separately built objects of the same shape as one value.
 *
 * Splitting on the key rather than on whether an iteratee was given is what
 * keeps the answer the same either way: deriving a key must not change how two
 * keys are compared.
 *
 * @returns {Function} A predicate that is `true` the first time it is offered
 * a key and `false` for every repeat, recording each key as it goes.
 */
export default function createSeenSet(): (key: unknown) => boolean {
  const primitives = new Set<unknown>();
  const objects: unknown[] = [];

  return (key: unknown): boolean => {
    if (key === null || typeof key !== 'object') {
      if (primitives.has(key)) {
        return false;
      }

      primitives.add(key);

      return true;
    }

    for (const other of objects) {
      if (isEql(key, other)) {
        return false;
      }
    }

    objects.push(key);

    return true;
  };
}
