# someIterAsync

Checks if any item in an async iterator matches a predicate.

## Parameters

- **iter** `AsyncIterable<T>` — The async iterable to check.
- **fn** `(val: T) => boolean | Promise<boolean>` — The predicate function.

## Returns

`Promise<boolean>` — A promise that resolves to true if any item matches, else false.

## Example

```js
async function* gen() { yield 1; yield 2; }
await someIterAsync(gen(), x => x > 1) //=> true
```
