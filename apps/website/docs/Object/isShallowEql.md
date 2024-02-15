> Checks if two values are the same by shallow comparison.

## Syntax

```ts
import { isShallowEql } from '@opentf/utils';

isShallowEql(val1: unknown, val2: unknown): Boolean;
```

## Examples

```ts
// Not equal
// *********
isShallowEql(undefined, null); //=> false

isShallowEql(false, 0); //=> false

isShallowEql(true, 1); //=> false

isShallowEql(1, "1"); //=> false

isShallowEql(1, 2); //=> false

isShallowEql("abc", "acb"); //=> false

isShallowEql(null, {}); //=> false

isShallowEql({}, null); //=> false

isShallowEql([1], [1, 2]); //=> false

isShallowEql([], {}); //=> false

isShallowEql([1, { a: 1 }], [1, { a: 1 }]); //=> false

isShallowEql({ a: 1, b: 2, c: [] }, { a: 1, b: 2, c: [] }); //=> false

// Equal
// *********
isShallowEql(undefined, undefined); //=>true

isShallowEql(null, null); //=>true

isShallowEql(false, false); //=>true

isShallowEql(true, true); //=>true

isShallowEql(1, 1); //=>true

isShallowEql(5.5, 5.5); //=>true

isShallowEql(NaN, NaN); //=>true

isShallowEql("abc", "abc"); //=>true

isShallowEql([], []); //=>true

isShallowEql({}, {}); //=>true

isShallowEql([1], [1]); //=>true

isShallowEql([1, 2, 3], [1, 2, 3]); //=>true

const b = { x: 0 };
isShallowEql([1, b], [1, b]); //=>true

isShallowEql({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 }); //=>true

const o = Object.create(null);
o.a = 1;
isShallowEql(o, { a: 1 }); //=>true

const obj = {};
isShallowEql(
  { a: 1, b: "xyz", c: null, d: 8.0, e: obj, f: true },
  { a: 1, b: "xyz", c: null, d: 8.0, e: obj, f: true },
); // => true
```
