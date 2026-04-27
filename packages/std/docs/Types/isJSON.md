# isJSON

Checks whether the given string is a valid JSON plain object

## Syntax

```ts
import { isJSON } from '@opentf/std';

isJSON(str: string): boolean
```

## Example

```js
isJSON("null") //=> false

isJSON("[]") //=> false

isJSON("{}") //=> true
```
