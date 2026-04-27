# words

Splits string into an array of its words.

## Syntax

```ts
import { words } from '@opentf/std';

words( str: string, pattern?: RegExp | string, ): string[]
```

## Example

```js
words('fred, barney, & pebbles') //=> ['fred', 'barney', 'pebbles']

words('fred, barney, & pebbles', /[^, ]+/g) //=> ['fred', 'barney', '&', 'pebbles']
```
