# round

Rounds a number to a specified number of decimal places without
floating point precision drift.

## Parameters

- **n** — The number to round.
- **decimals** — The number of decimal places (default 0).

## Returns

The rounded number.

## Example

```js
round(1.005, 2) //=> 1.01 (not 1.00 like Math.round)
round(1.23456, 3) //=> 1.235
```
