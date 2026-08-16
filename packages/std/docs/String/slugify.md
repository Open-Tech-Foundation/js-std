# slugify

Converts a string into a URL-friendly slug.

Diacritics are transliterated rather than stripped, so a letter with no
Unicode decomposition — `ø`, `ß`, `ł`, `đ` — becomes its ASCII equivalent
instead of being dropped from the slug.

## Parameters

- **str** `string` — The string to slugify.

## Returns

`string` — The slug.

## Examples

```js
slugify('Hello World!') //=> 'hello-world'
slugify('Café au Lait') //=> 'cafe-au-lait'
```

```js
slugify('Straße') //=> 'strasse'
slugify('Ølberg') //=> 'olberg'
```
