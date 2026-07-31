# mapRange

Re-maps a number from one range to another.

The inverse operation of `lerp` composed with it: where `lerp` turns a fraction
of a range into a value, this turns a value in one range into the value at the
same fraction of another. A sensor reading of 512 out of 1023 becomes the
percentage, the pixel or the volume it stands for.

The result is not clamped. A value outside the input range maps outside the
output range, which is usually what was meant — extrapolation is a valid answer
and it is the caller's to reject. Compose with `clamp` where it is not.

The ranges are given as pairs rather than as four loose numbers, because four
numbers in a row are easy to write in the wrong order and impossible to read
back. Either may run downwards, so a range can be inverted by giving it
reversed.

@param {number} val The value to re-map.
@param {[number, number]} from The range the value is in.
@param {[number, number]} to The range to map it to.
@returns {number} The re-mapped value.
@throws {RangeError} If the input range is empty.

### Example

```js
mapRange(5, [0, 10], [0, 100]) //=> 50

mapRange(512, [0, 1023], [0, 255]) //=> 127.75

// An inverted output range
mapRange(0.25, [0, 1], [100, 0]) //=> 75

// Outside the input range, and clamped back in
mapRange(15, [0, 10], [0, 100]) //=> 150
clamp(mapRange(15, [0, 10], [0, 100]), 0, 100) //=> 100
```
