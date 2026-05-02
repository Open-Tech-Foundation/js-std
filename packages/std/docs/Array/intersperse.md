# intersperse

Inserts a separator between the elements of its list argument.

@param {string|unknown[]} list The source list.
@param {Function|unknown} sep The separator to insert.
@returns {string|unknown[]} A new list with the separator inserted.

### Example

```js
intersperse([1, 2, 3], '*') //=> [1, '*', 2, '*', 3]
intersperse('Hello', '-') //=> "H-e-l-l-o"
```
