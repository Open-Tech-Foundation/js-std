# takeWhileIterAsync

Returns an AsyncGenerator that yields items from an AsyncIterable as long as a predicate is true.

## Parameters

- **iter** `AsyncIterable<T>` — The source async iterable.
- **fn** `(val: T) => boolean | Promise<boolean>` — The predicate function.

## Returns

`AsyncIterableIterator<T>` — A new async iterable iterator.

## Example

```js
async function* gen() { yield 1; yield 2; yield 3; }
const it = takeWhileIterAsync(gen(), x => x < 3);
for await (const x of it) { console.log(x); } //=> 1, 2
```
