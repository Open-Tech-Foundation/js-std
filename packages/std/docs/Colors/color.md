# color

🎨 A unified utility for parsing and converting colors between various formats.

## Syntax

```ts
color(input: ColorInput, format: ColorFormat): any
```

## Error Handling

Throws an `Error('Invalid Color')` if the input cannot be parsed or the format is invalid.

## Examples

```ts
color('red', 'hex'); //=> '#ff0000'
color('#00ff00', 'rgb'); //=> 'rgb(0, 255, 0)'
color([0, 0, 255], 'hsl'); //=> 'hsl(240, 100%, 50%)'
```
