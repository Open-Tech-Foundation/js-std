# isDataView

Checks if the given value is a DataView object.

## Syntax

```ts
import { isDataView } from '@opentf/std';

isDataView(val: unknown): val is DataView
```

## Example

```js
const buffer = new ArrayBuffer(8)

isDataView(buffer) //=> false

isDataView(new DataView(buffer)) //=> true
```
