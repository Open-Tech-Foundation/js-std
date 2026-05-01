# isBrowser

Checks if the current runtime is a web browser.

## Syntax

```ts
import { isBrowser } from '@opentf/std';

isBrowser(): boolean
```

## Returns

`boolean`: True if running in a browser, false otherwise.

## Example

```js
isBrowser() //=> true (in browser)
isBrowser() //=> false (in Node.js, Bun, Deno)
```
