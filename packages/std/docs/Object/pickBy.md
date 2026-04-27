# pickBy

Creates an object composed of the keys that the predicate returns truthy for.

## Syntax

```ts
import { pickBy } from '@opentf/std';

pickBy<T extends object>( obj: T, predicate: (value: T[keyof T], key: string) => boolean, ): Partial<T>
```

## Example

```js
pickBy({ a: 1, b: '2', c: 3 }, isNumber) //=> { a: 1, c: 3 }
```
