# randomString

Generates a cryptographically strong random string.

- `length` defaults to `10`
- `length` must be a non-negative integer
- `chars` must not be empty

### Example

```js

randomString() //=> 'kL8mP2nQ1r'
randomString(10) //=> 'aB3dE5gH1j'
randomString(5, '01') //=> '10110'
```
