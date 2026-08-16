<!-- handwritten -->

# color

Parses and converts colors between various formats.

The format decides the result type: most produce a CSS string, `number`
produces a packed integer, and the `*-object` and `*-array` formats produce
the components themselves. Passing a literal format narrows the return type
to exactly one of those, so no cast or hand-narrowing is needed.

## Parameters

- **input** `ColorInput` — The color input.
- **format** `ColorFormat` — The output format.

## Returns

`ColorOutput` — The converted color.

## Example

```js
color('#ff0000', 'rgb') //=> 'rgb(255, 0, 0)'
color('red', 'rgba-object') //=> { r: 255, g: 0, b: 0, a: 1 }
color({ h: 0, s: 100, l: 50 }, 'hex') //=> '#ff0000'
```
