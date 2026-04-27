# snakeCase

Converts string to snake_case.

## Syntax

```ts
import { snakeCase } from '@opentf/std';

snakeCase(str: string): string
```

## Example

```js
snakeCase('Foo Bar') //=> 'foo_bar'

snakeCase('fooBar') //=> 'foo_bar'

snakeCase('--FOO-BAR--') //=> 'foo_bar'
```
