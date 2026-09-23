/**
 * Creates a deterministic random-number generator from a seed.
 *
 * Each call to the returned function produces a float in `[0, 1)`, and the
 * same seed replays the same sequence on every run and every runtime — the
 * opposite of `randomInt` and friends, which draw from the host's
 * cryptographic source. Reach for this one for tests, games, procedural
 * generation and reproducible simulations; reach for those when the output
 * must be unpredictable.
 *
 * The stream is mulberry32 over a 32-bit state, with string seeds folded
 * through FNV-1a first, so `'demo'` and `420287` are both fair seeds and a
 * fractional number seeds the same stream as its integer part. It composes
 * with plain code rather than growing helpers: roll dice with
 * `Math.floor(rand() * 6) + 1`, pick with `arr[Math.floor(rand() * arr.length)]`.
 *
 * This is a statistical generator, not a secure one. Nothing about its output
 * resists prediction — anyone holding the seed, or enough outputs, replays
 * the stream — so never use it for keys, tokens or anything an adversary
 * must not guess.
 *
 * @param {number | string} seed The seed. Equal seeds replay equal streams.
 * @returns {() => number} A function producing the next float in `[0, 1)`.
 * @throws {TypeError} If `seed` is neither a number nor a string.
 *
 * @example
 * const rand = seededRandom('demo');
 * rand() //=> 0.8388890530914068
 * rand() //=> 0.13535357755608857
 *
 * @example
 * const a = seededRandom(42);
 * const b = seededRandom(42);
 * a() === b() //=> true
 */
export default function seededRandom(seed: number | string): () => number {
  if (typeof seed !== 'number' && typeof seed !== 'string') {
    throw new TypeError('seededRandom: expected a number or string seed.');
  }

  return mulberry32(typeof seed === 'string' ? hashSeed(seed) : seed >>> 0);
}

/** Folds a string seed into a 32-bit state. */
function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** A compact 32-bit generator with a full-period stream per state. */
function mulberry32(state: number): () => number {
  let a = state >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
