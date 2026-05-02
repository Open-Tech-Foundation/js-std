# words

Splits string into an array of its words.

### Example

```js

words('fred, barney, & pebbles') //=> ['fred', 'barney', 'pebbles']

words('fred, barney, & pebbles', /[^, ]+/g) //=> ['fred', 'barney', '&', 'pebbles']
```
