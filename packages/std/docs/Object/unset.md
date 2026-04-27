# unset

Removes the property of the given object at the given path.

## Syntax

```ts
import { unset } from '@opentf/std';

unset<T>(obj: T, path: string | unknown[]): T
```

## Example

```js
unset({a: 1, b: 2}, 'a') //=> {b: 2}
```
