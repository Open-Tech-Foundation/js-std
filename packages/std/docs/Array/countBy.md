# countBy

Creates an object composed of keys generated from the results of running each element of collection through iteratee.

@param {T[]} arr The source array.
@param {Function|string} by The iteratee to transform keys.
@returns {Record<string, number>} The composed aggregate object.

### Example

```js
countBy([6.1, 4.2, 6.3], Math.floor) //=> { '4': 1, '6': 2 }
```
