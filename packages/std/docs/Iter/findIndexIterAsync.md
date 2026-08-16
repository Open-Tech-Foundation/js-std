# findIndexIterAsync

Finds the index of the first item in an async iterator that matches a predicate.

## Parameters

- **iter** `AsyncIterable<T>` — The async iterable to search.
- **fn** `(val: T) => boolean | Promise<boolean>` — The predicate function.

## Returns

`Promise<number>` — A promise that resolves to the index of the first matching item, or -1.

## Example

```js
async function* gen() { yield 1; yield 2; }
await findIndexIterAsync(gen(), x => x === 2) //=> 1
```
