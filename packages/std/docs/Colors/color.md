<!-- handwritten -->

# color

Parses and converts colors between formats.

Takes a single object stating the conversion: the value, the format to read it
as, and the format to produce.

`to` decides the result type: most formats produce a CSS string, `number`
produces a packed integer, and the `*-object` and `*-array` formats produce the
components themselves. Passing a literal `to` narrows the return type to
exactly one of those, so no cast or hand-narrowing is needed.

`from` is needed only for arrays. An array is three numbers and an alpha, and
nothing in `[220, 60, 50, 1]` says which space they belong to, so it is read as
RGBA unless `from` says otherwise — which is what makes `hsla-array` output
readable again. Every other input states its own format: a string carries its
own syntax, and `{ h, s, l }` is hue-saturation-lightness by its keys. Passing
`from` alongside one of those throws rather than being ignored.

## Parameters

- **value** `ColorInput` — The color to read.
- **from** `ColorSourceFormat` _(optional)_ — How to read `value`: `'rgb'`,
  `'rgba'`, `'hsl'`, `'hsla'` or `'oklch'`. Arrays only; defaults to `'rgba'`.
- **to** `ColorFormat` _(optional)_ — The format to produce. Defaults to
  `'hex'`.

## Returns

`ColorOutput` — The converted color.

## Example

```js
color({ value: '#ff0000', to: 'rgb' }) //=> 'rgb(255, 0, 0)'
color({ value: 'red', to: 'rgba-object' }) //=> { r: 255, g: 0, b: 0, a: 1 }
color({ value: { h: 0, s: 100, l: 50 } }) //=> '#ff0000'
```

An array round trips only when it is read back in the space it was written in:

```js
const hsla = color({ value: '#3366cc', to: 'hsla-array' }) //=> [220, 60, 50, 1]

color({ value: hsla, from: 'hsla' }) //=> '#3366cc'
color({ value: hsla }) //=> '#dc3c32', read as RGBA
```
