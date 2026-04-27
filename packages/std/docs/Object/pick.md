# pick

Includes all the property paths from the given object for the given list of paths.

## Syntax

```ts
import { pick } from '@opentf/std';

pick( obj: object, ...paths: (string | unknown[])[] ): object
```

## Example

```js
pick({a: 1, b: 2}, 'a') //=> {a: 1}
```
