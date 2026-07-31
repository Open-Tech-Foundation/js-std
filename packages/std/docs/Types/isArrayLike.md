# isArrayLike

Checks if the given value is array-like: it has a valid `length` and so can be
indexed from `0` to `length - 1`.

A `NodeList`, a `FileList`, `arguments`, a `TypedArray` and a string are all
array-like without being arrays, which is what `Array.from` and
`Array.prototype.slice.call` exist for. `isArray` rejects every one of them.

`length` must be an integer between `0` and `Number.MAX_SAFE_INTEGER`, so an
object carrying an unrelated `length` — a negative, a fraction or a string — is
not mistaken for a collection.

Functions are excluded although they have a `length`: it is their arity, not a
count of elements, and treating one as a collection is always a mistake.

@param {unknown} val The value to check.
@returns {boolean} `true` if the value is array-like.

### Example

```js
isArrayLike([1, 2]) //=> true

isArrayLike('abc') //=> true

isArrayLike({ length: 2, 0: 'a', 1: 'b' }) //=> true

isArrayLike(new Set([1, 2])) //=> false

isArrayLike((a, b) => a + b) //=> false
```
