interface Entry<V> {
  value: V;
  expiresAt: number;
}

/**
 * A cache whose entries expire a fixed time after they are written.
 *
 * Expiry is lazy: an entry is dropped when it is next looked at, and `size` and
 * the iteration methods sweep before reporting so they never count something
 * already stale. No timers are used, deliberately — a timer per entry would
 * hold the event loop open and keep a process alive past its work.
 *
 * A cache that is written to but never read will therefore hold expired entries
 * until something touches it. Call `prune` if that matters.
 *
 * @example
 * const cache = new TtlCache<string, number>(1000);
 * cache.set('a', 1);
 * cache.get('a'); //=> 1
 * // ...over a second later
 * cache.get('a'); //=> undefined
 *
 * @example
 * // A per-entry lifetime overrides the default.
 * cache.set('short', 1, 50);
 */
export default class TtlCache<K, V> {
  private readonly map = new Map<K, Entry<V>>();
  private readonly ttl: number;

  /**
   * @param ttl How long an entry stays valid, in milliseconds.
   */
  constructor(ttl: number) {
    if (!Number.isFinite(ttl) || ttl <= 0) {
      throw new RangeError('The ttl must be a positive finite number.');
    }

    this.ttl = ttl;
  }

  /** The default lifetime this cache was created with, in milliseconds. */
  get defaultTtl(): number {
    return this.ttl;
  }

  /** The number of unexpired entries, after sweeping the expired ones. */
  get size(): number {
    this.prune();

    return this.map.size;
  }

  private isExpired(entry: Entry<V>): boolean {
    return entry.expiresAt <= Date.now();
  }

  /**
   * Returns the value for a key.
   *
   * @returns The value, or `undefined` if the key is absent or expired.
   */
  get(key: K): V | undefined {
    const entry = this.map.get(key);

    if (entry === undefined) {
      return undefined;
    }

    if (this.isExpired(entry)) {
      this.map.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Stores a value. Writing an existing key restarts its lifetime.
   *
   * @param ttl A lifetime for this entry only, in milliseconds.
   */
  set(key: K, value: V, ttl: number = this.ttl): this {
    if (!Number.isFinite(ttl) || ttl <= 0) {
      throw new RangeError('The ttl must be a positive finite number.');
    }

    this.map.set(key, { value, expiresAt: Date.now() + ttl });

    return this;
  }

  /** Checks for an unexpired key, dropping it if it has expired. */
  has(key: K): boolean {
    const entry = this.map.get(key);

    if (entry === undefined) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.map.delete(key);
      return false;
    }

    return true;
  }

  /**
   * The milliseconds left before a key expires, or `undefined` if it is absent
   * or already expired.
   */
  ttlOf(key: K): number | undefined {
    const entry = this.map.get(key);

    if (entry === undefined || this.isExpired(entry)) {
      return undefined;
    }

    return entry.expiresAt - Date.now();
  }

  /** Removes a key. Returns whether it was present and unexpired. */
  delete(key: K): boolean {
    const existed = this.has(key);
    this.map.delete(key);

    return existed;
  }

  /** Removes every entry. */
  clear(): void {
    this.map.clear();
  }

  /**
   * Drops every expired entry now, rather than waiting for something to look at
   * them.
   *
   * @returns The number of entries removed.
   */
  prune(): number {
    let removed = 0;

    for (const [key, entry] of this.map) {
      if (this.isExpired(entry)) {
        this.map.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /** The unexpired keys, in insertion order. */
  keys(): IterableIterator<K> {
    this.prune();

    return this.map.keys();
  }

  /** The unexpired values, in insertion order. */
  *values(): IterableIterator<V> {
    this.prune();

    for (const entry of this.map.values()) {
      yield entry.value;
    }
  }

  /** The unexpired entries, in insertion order. */
  *entries(): IterableIterator<[K, V]> {
    this.prune();

    for (const [key, entry] of this.map) {
      yield [key, entry.value];
    }
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  forEach(callback: (value: V, key: K, cache: this) => void): void {
    for (const [key, value] of this.entries()) {
      callback(value, key, this);
    }
  }
}
