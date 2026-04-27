# omit

Removes all the property paths from the given object for the given list of paths.

## Syntax

```ts
import { omit } from '@opentf/std';

omit( obj: object, ...paths: (string | unknown[])[] ): object
```

## Example

```js
omit({a: 1, b: 2}, 'a') //=> {b: 2}
```
