# truncate

Truncates string if it's longer than the given maximum string length.

@param {string} str The string to truncate.
@param {number} [length=30] The maximum string length.
@param {string} [omission='...'] The string to indicate truncation.
@returns {string} The truncated string.

### Example

```js
truncate('hi-package', 8) //=> 'hi-pa...'
```
