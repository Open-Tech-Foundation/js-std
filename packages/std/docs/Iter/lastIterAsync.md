# lastIterAsync

Returns the last item from an async iterable.

## Parameters

- **iter** `AsyncIterable<T>` — The async iterable to search.

## Returns

`Promise<T | undefined>` — A promise that resolves to the last item, or undefined.

## Example

```js
async function* gen() { yield 1; yield 2; }
await lastIterAsync(gen()) //=> 2
```
