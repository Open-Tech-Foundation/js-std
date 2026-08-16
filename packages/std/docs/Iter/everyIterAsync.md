# everyIterAsync

Checks if all items in an async iterator match a predicate.

## Parameters

- **iter** `AsyncIterable<T>` — The async iterable to check.
- **fn** `(val: T) => boolean | Promise<boolean>` — The predicate function.

## Returns

`Promise<boolean>` — A promise that resolves to true if all items match, else false.

## Example

```js
async function* gen() { yield 1; yield 2; }
await everyIterAsync(gen(), x => x > 0) //=> true
```
