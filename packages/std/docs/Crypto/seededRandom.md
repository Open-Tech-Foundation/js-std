# seededRandom

Creates a deterministic random-number generator from a seed.

Each call to the returned function produces a float in `[0, 1)`, and the
same seed replays the same sequence on every run and every runtime — the
opposite of `randomInt` and friends, which draw from the host's
cryptographic source. Reach for this one for tests, games, procedural
generation and reproducible simulations; reach for those when the output
must be unpredictable.

The stream is mulberry32 over a 32-bit state, with string seeds folded
through FNV-1a first, so `'demo'` and `420287` are both fair seeds and a
fractional number seeds the same stream as its integer part. It composes
with plain code rather than growing helpers: roll dice with
`Math.floor(rand() * 6) + 1`, pick with `arr[Math.floor(rand() * arr.length)]`.

This is a statistical generator, not a secure one. Nothing about its output
resists prediction — anyone holding the seed, or enough outputs, replays
the stream — so never use it for keys, tokens or anything an adversary
must not guess.

## Parameters

- **seed** `number | string` — The seed. Equal seeds replay equal streams.

## Returns

`() => number` — A function producing the next float in `[0, 1)`.

## Throws

- `TypeError` — If `seed` is neither a number nor a string.

## Examples

```js
const rand = seededRandom('demo');
rand() //=> 0.8388890530914068
rand() //=> 0.13535357755608857
```

```js
const a = seededRandom(42);
const b = seededRandom(42);
a() === b() //=> true
```
