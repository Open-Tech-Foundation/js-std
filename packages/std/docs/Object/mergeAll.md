# mergeAll

Deeply merges all the given objects or arrays.

## Syntax

```ts
import { mergeAll } from '@opentf/std';

mergeAll( ...objs: (Record<string, unknown> | unknown[])[] ): Record<string, unknown> | unknown[]
```

## Example

```js
mergeAll([{a: 1}, {b: 2}]) //=> {a: 1, b: 2}

mergeAll([[1], [2]]) //=> [1, 2]
```
