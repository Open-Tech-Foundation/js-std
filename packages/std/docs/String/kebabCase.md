# kebabCase

Converts string to kebab-case.

## Syntax

```ts
import { kebabCase } from '@opentf/std';

kebabCase(str: string): string
```

## Example

```js
kebabCase('Foo Bar') //=> 'foo-bar'

kebabCase('fooBar') //=> 'foo-bar'

kebabCase('__FOO_BAR__') //=> 'foo-bar'
```
