# isNode

Checks if the current runtime is Node.js.

## Syntax

```ts
import { isNode } from '@opentf/std';

isNode(): boolean
```

## Returns

`boolean`: True if running in Node.js, false otherwise.

## Example

```js
isNode() //=> true (in Node.js)
isNode() //=> false (in browser, Bun, Deno)
```
