# range

Creates an array of numbers (positive and/or negative) progressing from start up to, but not including, end.

### Example

```js

range(4) //=> [0, 1, 2, 3]

range(-4) //=> [0, -1, -2, -3]

range(1, 5) //=> [1, 2, 3, 4]

range(0, 20, 5) //=> [0, 5, 10, 15]

range(0, -4, -1) //=> [0, -1, -2, -3]

range(1, 4, {step: 1, inclusiveEnd: true}) //=> [1, 2, 3, 4]
```
