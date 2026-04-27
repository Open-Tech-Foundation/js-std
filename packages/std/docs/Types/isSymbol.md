# isSymbol

Checks if the given value is a Symbol.

## Syntax

```ts
import { isSymbol } from '@opentf/std';

isSymbol(val: unknown): val is symbol
```

## Example

```js
isSymbol(Symbol()) //=> true

isSymbol(Symbol('abc')) //=> true

isSymbol('abc') //=> false
```
