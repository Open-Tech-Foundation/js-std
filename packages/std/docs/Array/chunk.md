# chunk

Splits an array into groups of a specified size.

@param {T[]} arr The source array.
@param {number} size The length of each chunk.
@returns {T[][]} A new array containing the chunks.

### Example

```js
chunk(['a', 'b', 'c', 'd'], 2) //=> [['a', 'b'], ['c', 'd']]
chunk(['a', 'b', 'c', 'd'], 3) //=> [['a', 'b', 'c'], ['d']]
```
