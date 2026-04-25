# pad

Pads string on the left and right sides if it's shorter than length.
Padding characters are truncated if they can't be evenly divided by length.

### Example

```js

pad('abc', 8) //=> '  abc   '

pad('abc', 8, '_-') //=> '_-abc_-_'

pad('abc', 3) //=> 'abc'
```
