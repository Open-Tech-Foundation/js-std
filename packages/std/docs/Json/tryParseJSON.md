# tryParseJSON

Safely parses a JSON string without throwing. With `temporal:true`, ISO strings revive to `DateTime`/`Duration`.

### Syntax

```ts
tryParseJSON<T>(text: unknown, fallback?: T, reviverOrOptions?: ((key: string, value: unknown) => unknown) | { reviver?: (key: string, value: unknown) => unknown, temporal?: boolean }): T | undefined
```

### Example

```js
tryParseJSON('{"a":1}') //=> {a:1}
tryParseJSON('bad', {a:1}) //=> {a:1}
tryParseJSON(123, []) //=> []
tryParseJSON('{"t":"2024-01-01T00:00:00.000Z"}', undefined, { temporal: true }) //=> {t: DateTime}
tryParseJSON('{"d":"P1DT2H"}', undefined, { temporal: true }) //=> {d: Duration}
```
