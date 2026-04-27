# toSet

Sets the value to an object at the given path & returns new object.

## Syntax

```ts
import { toSet } from '@opentf/std';

toSet<T>( obj: T, path: string | unknown[], value: unknown | ((val: unknown) => unknown), ): T
```

## Example

```js
toSet({}, 'a.b', 1) //=> {a: {b: 1} }
```
