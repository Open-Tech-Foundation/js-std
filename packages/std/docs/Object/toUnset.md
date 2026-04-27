# toUnset

Removes the property of the given object at the given path & returns new object.

## Syntax

```ts
import { toUnset } from '@opentf/std';

toUnset<T>(obj: T, path: string | unknown[]): T
```

## Example

```js
toUnset({a: 1, b: 2}, 'a') //=> {b: 2}
```
