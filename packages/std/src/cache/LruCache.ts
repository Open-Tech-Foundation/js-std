/**
 * A fixed-capacity cache that evicts the least recently used entry once it is
 * full.
 *
 * Recency is tracked by `Map` insertion order: reading or writing a key moves
 * it to the end, so the oldest key is always the first one the map yields. That
 * makes every operation O(1) with no auxiliary linked list.
 *
 * `get` counts as a use; `peek` deliberately does not, so a cache can be
 * inspected without disturbing what it is about to evict.
 *
 * @example
 * const cache = new LruCache<string, number>(2);
 * cache.set('a', 1);
 * cache.set('b', 2);
 * cache.get('a');    // 'a' is now the most recently used
 * cache.set('c', 3); // evicts 'b', not 'a'
 * cache.has('b');    //=> false
 */
export default class LruCache<K, V> {
  private readonly map = new Map<K, V>();
  private readonly max: number;

  /**
   * @param maxSize The number of entries to hold before evicting.
   */
  constructor(maxSize: number) {
    if (!Number.isInteger(maxSize) || maxSize < 1) {
      throw new RangeError('The maxSize must be a positive integer.');
    }

    this.max = maxSize;
  }

  /** The capacity this cache was created with. */
  get maxSize(): number {
    return this.max;
  }

  /** The number of entries currently held. */
  get size(): number {
    return this.map.size;
  }

  /**
   * Returns the value for a key, marking it as the most recently used.
   *
   * @returns The value, or `undefined` if the key is absent.
   */
  get(key: K): V | undefined {
    if (!this.map.has(key)) {
      return undefined;
    }

    // Re-inserting moves the key to the end of the iteration order.
    const value = this.map.get(key) as V;
    this.map.delete(key);
    this.map.set(key, value);

    return value;
  }

  /**
   * Returns the value for a key **without** marking it as used, leaving the
   * eviction order untouched.
   */
  peek(key: K): V | undefined {
    return this.map.get(key);
  }

  /**
   * Stores a value, marking the key as the most recently used and evicting the
   * least recently used entry if that pushes the cache over capacity.
   */
  set(key: K, value: V): this {
    // Delete first so an existing key is re-inserted at the end rather than
    // keeping its original position.
    this.map.delete(key);
    this.map.set(key, value);

    if (this.map.size > this.max) {
      const oldest = this.map.keys().next();

      if (!oldest.done) {
        this.map.delete(oldest.value);
      }
    }

    return this;
  }

  /** Checks for a key without marking it as used. */
  has(key: K): boolean {
    return this.map.has(key);
  }

  /** Removes a key. Returns whether it was present. */
  delete(key: K): boolean {
    return this.map.delete(key);
  }

  /** Removes every entry. */
  clear(): void {
    this.map.clear();
  }

  /** The keys, least recently used first. */
  keys(): IterableIterator<K> {
    return this.map.keys();
  }

  /** The values, least recently used first. */
  values(): IterableIterator<V> {
    return this.map.values();
  }

  /** The entries, least recently used first. */
  entries(): IterableIterator<[K, V]> {
    return this.map.entries();
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.map.entries();
  }

  forEach(callback: (value: V, key: K, cache: this) => void): void {
    for (const [key, value] of this.map) {
      callback(value, key, this);
    }
  }
}
