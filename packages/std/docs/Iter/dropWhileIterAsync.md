# dropWhileIterAsync

Returns an AsyncGenerator that skips items from an AsyncIterable as long as a predicate is true, then yields the rest.

## Parameters

- **iter** `AsyncIterable<T>` — The source async iterable.
- **fn** `(val: T) => boolean | Promise<boolean>` — The predicate function.

## Returns

`AsyncIterableIterator<T>` — A new async iterable iterator.

## Example

```js
async function* gen() { yield 1; yield 2; yield 3; }
const it = dropWhileIterAsync(gen(), x => x < 2);
for await (const x of it) { console.log(x); } //=> 2, 3
```
