# intersperse

Inserts a separator between the elements of its list argument.

Passing a function calls it for each gap, with the index of that gap, and
inserts what it returns. A function cannot be distinguished from a value to
insert by type, so `sep` is `unknown` and the form is chosen at run time.

@param {string|unknown[]} list The source list.
@param {unknown} sep The separator to insert, or a function returning it.
@returns {string|unknown[]} A new list with the separator inserted.

### Example

```js
intersperse([1, 2, 3], '*') //=> [1, '*', 2, '*', 3]
intersperse('Hello', '-') //=> "H-e-l-l-o"

intersperse([1, 2, 3], (i) => i) //=> [1, 0, 2, 1, 3]
```
