# stripDiacritics

Removes accents and other diacritics from Latin text, leaving the base letters.

Case is preserved — this normalises characters, it does not transform case. Letters outside the Latin scripts are left alone, so Greek, Cyrillic, Arabic and CJK text passes through unchanged rather than being mangled.

@param str - The string to normalise.
@returns The string with its diacritics removed.

### Example

```js
stripDiacritics('José') //=> 'Jose'
stripDiacritics('Ångström') //=> 'Angstrom'

// Letters with no decomposition are transliterated, not dropped.
stripDiacritics('Straße') //=> 'Strasse'
stripDiacritics('Ølberg') //=> 'Olberg'

// Useful for accent-insensitive search.
stripDiacritics(query).toLowerCase() === stripDiacritics(name).toLowerCase()
```
