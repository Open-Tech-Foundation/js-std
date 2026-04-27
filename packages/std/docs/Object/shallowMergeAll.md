# shallowMergeAll

Merges all the given objects or arrays.

## Syntax

```ts
import { shallowMergeAll } from '@opentf/std';

shallowMergeAll( ...objs: (Record<string, unknown> | unknown[])[] ): Record<string, unknown> | unknown[]
```

## Example

```js
shallowMergeAll([{a: 1}, {b: 2}]) //=> {a: 1, b: 2}

shallowMergeAll([[1], [2]]) //=> [1, 2]
```
