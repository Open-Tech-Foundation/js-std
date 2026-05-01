# isBun

Checks if the current runtime is Bun.

## Syntax

```ts
import { isBun } from '@opentf/std';

isBun(): boolean
```

## Returns

`boolean`: True if running in Bun, false otherwise.

## Example

```js
isBun() //=> true (in Bun)
isBun() //=> false (in Node.js, Deno, browser)
```
