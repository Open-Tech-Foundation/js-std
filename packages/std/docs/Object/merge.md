# merge

It deeply merges objects or arrays.

## Syntax

```ts
import { merge } from '@opentf/std';

merge(...objs: object[]): object
```

## Example

```js
const a = { a: { b: 1 } };
const b = { a: { c: 2 } };
merge(a, b); //=> {a: { b: 1, c: 2 } }
```
