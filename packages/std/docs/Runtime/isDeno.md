# isDeno

Checks if the current runtime is Deno.

## Syntax

```ts
import { isDeno } from '@opentf/std';

isDeno(): boolean
```

## Returns

`boolean`: True if running in Deno, false otherwise.

## Example

```js
isDeno() //=> true (in Deno)
isDeno() //=> false (in Node.js, Bun, browser)
```
