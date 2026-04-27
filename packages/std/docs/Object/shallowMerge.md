# shallowMerge

Merges the given two objects or arrays.

## Syntax

```ts
import { shallowMerge } from '@opentf/std';

shallowMerge( ...objs: (Record<string, unknown> | unknown[])[] ): Record<string, unknown> | unknown[]
```

## Example

```js
shallowMerge({a: 1}, {b: 2}) //=> {a: 1, b: 2}

shallowMerge([1], [2]) //=> [1, 2]
```
