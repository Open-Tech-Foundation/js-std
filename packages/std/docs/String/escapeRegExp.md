# escapeRegExp

Escapes the RegExp special characters in string.

## Syntax

```ts
import { escapeRegExp } from '@opentf/std';

escapeRegExp(str: string): string
```

## Example

```js
escapeRegExp('[opentf](https://opentf.org/)') //=> '\\[opentf\\]\\(https://opentf\\.org/\\)'
```
