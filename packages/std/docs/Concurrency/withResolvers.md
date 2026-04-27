# withResolvers

Creates a promise along with its resolve and reject functions.

## Syntax

```ts
import { withResolvers } from '@opentf/std';

withResolvers<T>():
```

## Returns

`Object`: An object containing the promise and its resolvers.

## Example

```js
const { promise, resolve, reject } = withResolvers();
```
