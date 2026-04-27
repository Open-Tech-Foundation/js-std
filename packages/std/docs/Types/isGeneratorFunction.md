# isGeneratorFunction

Checks if the given value is a generator function.

## Syntax

```ts
import { isGeneratorFunction } from '@opentf/std';

isGeneratorFunction( val: unknown, ): val is GeneratorFunction
```

## Example

```js
isFunction(function() {}) //=> false

isFunction(function*() {}) //=> true
```
