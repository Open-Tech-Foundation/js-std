# nthIterAsync

Returns the nth item (0-indexed) from an async iterable.

## Parameters

- **iter** `AsyncIterable<T>` — The async iterable to search.
- **n** `number` — The index of the item to return.

## Returns

`Promise<T | undefined>` — A promise that resolves to the nth item, or undefined.

## Example

```js
async function* gen() { yield 1; yield 2; }
await nthIterAsync(gen(), 1) //=> 2
```
