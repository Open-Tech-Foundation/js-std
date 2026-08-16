# filterIterAsync

Filters items in an async iterator based on a predicate.

## Parameters

- **iter** `AsyncIterable<T>` — The async iterable to filter.
- **fn** `(val: T) => boolean | Promise<boolean>` — The predicate function.

## Returns

`AsyncIterableIterator<T>` — A new async iterable iterator.

## Example

```js
async function* gen() { yield 1; yield 2; yield 3; }
const evens = filterIterAsync(gen(), x => x % 2 === 0);
for await (const x of evens) { console.log(x); } //=> 2
```
