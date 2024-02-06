> It removes a property from an object path.

## Syntax

```ts
import { delInObj } from '@opentf/utils';

delInObj(obj: ObjType, path: string): Boolean;
```

## Examples

```ts
const obj = { a: 1, b: 2 };
delInObj(obj, "a"); //=> true
console.log(obj); //=> {b: 2}
delInObj(obj, "c"); //=> false

const arr = [1, 2, 3];
delInObj(obj, "0"); //=> true
console.log(obj); //=> [2, 3]
delInObj(obj, "3"); //=> false
```
