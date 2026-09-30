# get

Gets the value of an object at the given path.

## Parameters

- **obj** `Object` — The object to query.
- **path** `string|Array` — The path of the property to get.
- **options.defaultValue** `unknown` _(optional)_ — The value returned for undefined resolved values.

## Returns

`unknown` — The resolved value.

## Example

```js
get({a: {b: {c: 1}}}, 'a.b.c') //=> 1
get({ a: 1 }, 'b', { defaultValue: 'missing' }) //=> 'missing'
```
