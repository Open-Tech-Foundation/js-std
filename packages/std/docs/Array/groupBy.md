# groupBy

Creates an object composed of keys generated from the results of running each element of collection through iteratee.

@param {T[]} arr The source array.
@param {Function|string} key The iteratee to transform keys.
@returns {Record<string, T[]>} The composed aggregate object.

### Example

```js
groupBy([6.1, 4.2, 6.3], Math.floor) //=> { '4': [4.2], '6': [6.1, 6.3] }
```
