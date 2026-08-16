# findLastIterAsync

Finds the last item in an async iterator that matches a predicate.

## Parameters

- **iter** `AsyncIterable<T>` — The async iterable to search.
- **fn** `(val: T) => boolean | Promise<boolean>` — The predicate function.

## Returns

`Promise<T | undefined>` — A promise that resolves to the last matching item, or undefined.

## Example

```js
async function* gen() { yield 1; yield 2; yield 3; }
await findLastIterAsync(gen(), x => x < 3) //=> 2
```
