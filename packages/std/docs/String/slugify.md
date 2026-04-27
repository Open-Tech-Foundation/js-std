# slugify

Converts a string into a URL-friendly slug.

## Syntax

```ts
import { slugify } from '@opentf/std';

slugify(str: string): string
```

## Example

```js
slugify('Hello World!') //=> 'hello-world'
slugify('Café au Lait') //=> 'cafe-au-lait'
```
