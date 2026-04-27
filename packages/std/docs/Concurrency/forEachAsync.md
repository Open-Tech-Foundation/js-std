# forEachAsync

Asynchronous version of `Array.prototype.forEach`.
By default, it runs all iterations in parallel.

## Syntax

```ts
import { forEachAsync } from '@opentf/std';

forEachAsync
```

## Example

```js
await forEachAsync([1, 2, 3], async (n) => console.log(n))
```
