# countIterAsync

Returns the total count of items in an async iterable.

## Parameters

- **iter** `AsyncIterable<unknown>` — The async iterable to count.

## Returns

`Promise<number>` — A promise that resolves to the total count of items.

## Example

```js
async function* gen() { yield 1; yield 2; }
await countIterAsync(gen()) //=> 2
```
