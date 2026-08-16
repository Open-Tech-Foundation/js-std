# isEmpty

Checks if the given collection is empty.

## Parameters

- **val** `unknown` — The value to check.
- **sparse** `boolean` _(default: `false`)_ — Whether to check for sparse arrays.

## Returns

`boolean` — True if empty, false otherwise.

## Example

```js
isEmpty([]) //=> true
isEmpty({a: 1}) //=> false
```
