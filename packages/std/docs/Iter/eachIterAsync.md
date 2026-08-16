# eachIterAsync

Executes a function for each item in an async iterator.

## Parameters

- **iter** `AsyncIterable<T>` — The async iterable to iterate over.
- **fn** `(val: T) => void | Promise<void>` — The function to execute.

## Returns

`Promise<void>` — A promise that resolves when iteration is complete.

## Example

```js
async function* gen() { yield 1; yield 2; }
await eachIterAsync(gen(), x => console.log(x)) //=> Logs 1, 2
```
