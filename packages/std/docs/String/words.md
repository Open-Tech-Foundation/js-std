# words

Splits string into an array of its words.

String patterns are treated literally. Use a `RegExp` when you need regex
matching behavior.

### Example

```js

words('fred, barney, & pebbles') //=> ['fred', 'barney', 'pebbles']

words('fred, barney, & pebbles', /[^, ]+/g) //=> ['fred', 'barney', '&', 'pebbles']

words('a+b+c', '+') //=> ['+', '+']
```
