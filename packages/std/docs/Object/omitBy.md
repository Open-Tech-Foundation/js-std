# omitBy

Creates an object composed of the keys that the predicate returns falsy for.

## Syntax

```ts
import { omitBy } from '@opentf/std';

omitBy<T extends object>( obj: T, predicate: (value: T[keyof T], key: string) => boolean, ): Partial<T>
```

## Example

```js
omitBy({ a: 1, b: '2', c: 3 }, isNumber) //=> { b: '2' }
```
