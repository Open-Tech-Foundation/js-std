# tryStringifyJSON

Safely stringifies a value to JSON without throwing. `bigint` is stringified as decimal strings by default. With `temporal:true`, `DateTime`/`Duration` and native `Temporal` are stringified via ISO.

### Syntax

```ts
tryStringifyJSON(value: unknown, fallback?: string, options?: { replacer?: Function | (string|number)[] | null, space?: string | number, temporal?: boolean }): string | undefined
```

### Example

```js
tryStringifyJSON({a:1}) //=> '{"a":1}'
tryStringifyJSON({n: BigInt(1)}) //=> '{"n":"1"}'
tryStringifyJSON({t: new DateTime("2024-01-01")}, undefined, {temporal:true}) //=> '{"t":"2024-01-01T00:00:00.000+00:00[UTC]"}'
const o={}; o.self=o; tryStringifyJSON(o, '{}') //=> '{}'
```
