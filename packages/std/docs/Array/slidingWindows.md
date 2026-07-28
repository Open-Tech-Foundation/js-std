# slidingWindows

Slides a fixed-size window over an array, one element at a time.

Unlike `chunk`, which cuts an array into separate pieces, the windows here overlap — every element but the ends appears in several of them. That is what makes it useful for anything comparing neighbours: moving averages, deltas between consecutive readings, n-grams, trend detection.

Only whole windows are returned, so an array shorter than the window yields nothing rather than a partial result.

@param arr - The source array.
@param size - The length of each window.
@returns The windows, in order.
@throws If the size is not an integer greater than zero.

### Example

```js
slidingWindows([1, 2, 3, 4], 2) //=> [[1, 2], [2, 3], [3, 4]]

// A three-point moving average.
slidingWindows(readings, 3).map((w) => mean(w))

// Too short for a whole window.
slidingWindows([1, 2], 3) //=> []
```
