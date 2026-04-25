# truncate

Truncates string if it's longer than the given maximum string length.
The last characters of the truncated string are replaced with the omission string which defaults to "...".

### Example

```js

truncate('hi-package', 8) //=> 'hi-pa...'

truncate('hi-package', 5, '---') //=> 'hi---'
```
