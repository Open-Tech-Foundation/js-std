# toArrayIterAsync

Collects all items from an async iterator into an array.

## Parameters

- **iter** `AsyncIterable<T>` — The async iterable to collect.

## Returns

`Promise<T[]>` — A promise that resolves to an array of all items.

## Example

```js
async function* gen() { yield 1; yield 2; }
await toArrayIterAsync(gen()) //=> [1, 2]
```
