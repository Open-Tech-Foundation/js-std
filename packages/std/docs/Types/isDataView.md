# isDataView

Checks if the given value is a DataView object.

### Example

```js

const buffer = new ArrayBuffer(8)

isDataView(buffer) //=> false

isDataView(new DataView(buffer)) //=> true
```
