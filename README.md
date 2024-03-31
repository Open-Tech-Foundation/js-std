<img align="left" src="https://open-tech-foundation.pages.dev/img/Logo.svg" width="50" height="50">

&nbsp;[OPEN TECH FOUNDATION](https://open-tech-foundation.pages.dev/)

<div align="center">

# JavaScript Standard Library

[![Build](https://github.com/open-tech-foundation/js-std/actions/workflows/build.yml/badge.svg)](https://github.com/open-tech-foundation/js-std/actions/workflows/build.yml)

</div>

> An Extensive JavaScript Standard Library.

<div align="center">

## [Playground](https://js-std.pages.dev/playground) | [Documentation](https://js-std.pages.dev)

</div>

## Features

- Simple API
- Practical Default Options
- Includes Async Utils
- TypeScript Support
- ESM

## Installation

```sh
npm install @opentf/std
```

```sh
yarn add @opentf/std
```

```sh
pnpm add @opentf/std
```

```sh
bun add @opentf/std
```

## Usage

```ts
import {
  isNum,
  pascalCase,
  sort,
  clone,
  isEql,
  isEqlArr,
  sleep,
} from "@opentf/std";

isNum(NaN); //=> false

pascalCase("pascal case"); //=> PascalCase

sort([1, 10, 21, 2], "desc"); //=> [ 21, 10, 2, 1 ]

const obj = {
  a: 1,
  b: "abc",
  c: new Map([["key", "val"]]),
};
clone(obj); // It returns deeply cloned value.

const mapA = new Map([
  ["a", 1],
  ["b", 2],
]);
const mapB = new Map([
  ["b", 2],
  ["a", 1],
]);
isEql(mapA, mapB); //=> false

isEqlArr([1, 2, 3], [2, 3, 1]); //=> true

await sleep(1000); // It suspends the exection for 1 second.
```

## API

### Array

- [arrIns](https://js-std.pages.dev/Array/arrIns)
- [arrReplace](https://js-std.pages.dev/Array/arrReplace)
- [arrRm](https://js-std.pages.dev/Array/arrRm)
- [bounds](https://js-std.pages.dev/Array/bounds)
- [chunk](https://js-std.pages.dev/Array/chunk)
- [compact](https://js-std.pages.dev/Array/compact)
- [countBy](https://js-std.pages.dev/Array/countBy)
- [diff](https://js-std.pages.dev/Array/diff)
- [drop](https://js-std.pages.dev/Array/drop)
- [groupBy](https://js-std.pages.dev/Array/groupBy)
- [intersection](https://js-std.pages.dev/Array/intersection)
- [intersperse](https://js-std.pages.dev/Array/intersperse)
- [max](https://js-std.pages.dev/Array/max)
- [min](https://js-std.pages.dev/Array/min)
- [move](https://js-std.pages.dev/Array/move)
- [range](https://js-std.pages.dev/Array/range)
- [sort](https://js-std.pages.dev/Array/sort)
- [sortBy](https://js-std.pages.dev/Array/sortBy)
- [symDiff](https://js-std.pages.dev/Array/symDiff)
- [take](https://js-std.pages.dev/Array/take)
- [union](https://js-std.pages.dev/Array/union)
- [uniq](https://js-std.pages.dev/Array/uniq)

## Async

- [asyncFilter](https://js-std.pages.dev/Array/asyncFilter)
- [asyncForEach](https://js-std.pages.dev/Array/asyncForEach)
- [asyncMap](https://js-std.pages.dev/Array/asyncMap)

### Maths

- [clamp](https://js-std.pages.dev/Maths/clamp)
- [divMod](https://js-std.pages.dev/Maths/divMod)
- [isEven](https://js-std.pages.dev/Maths/isEven)
- [isOdd](https://js-std.pages.dev/Maths/isOdd)
- [mean](https://js-std.pages.dev/Maths/mean)
- [median](https://js-std.pages.dev/Maths/median)
- [mode](https://js-std.pages.dev/Maths/mode)
- [percentage](https://js-std.pages.dev/Maths/percentage)
- [percentageOf](https://js-std.pages.dev/Maths/percentageOf)
- [prod](https://js-std.pages.dev/Maths/prod)
- [sum](https://js-std.pages.dev/Maths/sum)

### Number

- [isNegZero](https://js-std.pages.dev/Number/isNegZero)
- [isZero](https://js-std.pages.dev/Number/isZero)
- [toNum](https://js-std.pages.dev/Number/toNum)

### Function

- [sleep](https://js-std.pages.dev/Timers/sleep)
- [noop](https://js-std.pages.dev/Timers/noop)

### Colors

- [hexToRGB](https://js-std.pages.dev/Misc/hexToRGB)

### Assert

- [isEmpty](https://js-std.pages.dev/Assert/isEmpty)
- [isEql](https://js-std.pages.dev/Assert/isEql)
- [isEqlArr](https://js-std.pages.dev/Assert/isEqlArr)
- [isNil](https://js-std.pages.dev/Assert/isNil)
- [isShallowEql](https://js-std.pages.dev/Assert/isShallowEql)

### Object

- [clone](https://js-std.pages.dev/Object/clone)
- [fromPath](https://js-std.pages.dev/Object/fromPath)
- [get](https://js-std.pages.dev/Object/get)
- [has](https://js-std.pages.dev/Object/has)
- [merge](https://js-std.pages.dev/Object/merge)
- [mergeAll](https://js-std.pages.dev/Object/mergeAll)
- [omit](https://js-std.pages.dev/Object/omit)
- [pick](https://js-std.pages.dev/Object/pick)
- [set](https://js-std.pages.dev/Object/set)
- [shallowMerge](https://js-std.pages.dev/Object/shallowMerge)
- [shallowMergeAll](https://js-std.pages.dev/Object/shallowMergeAll)
- [size](https://js-std.pages.dev/Object/size)
- [toPath](https://js-std.pages.dev/Object/toPath)
- [unset](https://js-std.pages.dev/Object/unset)

### String

- [camelCase](https://js-std.pages.dev/String/camelCase)
- [capitalize](https://js-std.pages.dev/String/capitalize)
- [insertAt](https://js-std.pages.dev/String/insertAt)
- [isEmail](https://js-std.pages.dev/String/isEmail)
- [pascalCase](https://js-std.pages.dev/String/pascalCase)
- [replaceAt](https://js-std.pages.dev/String/replaceAt)
- [strReplace](https://js-std.pages.dev/String/strReplace)

### Types

- [isArr](https://js-std.pages.dev/Types/isArr)
- [isArrBuf](https://js-std.pages.dev/Types/isArrBuf)
- [isAsynFn](https://js-std.pages.dev/Types/isAsynFn)
- [isBigInt](https://js-std.pages.dev/Types/isBigInt)
- [isBlob](https://js-std.pages.dev/Types/isBlob)
- [isBool](https://js-std.pages.dev/Types/isBool)
- [isDataView](https://js-std.pages.dev/Types/isDataView)
- [isDate](https://js-std.pages.dev/Types/isDate)
- [isErr](https://js-std.pages.dev/Types/isErr)
- [isFn](https://js-std.pages.dev/Types/isFn)
- [isGenFn](https://js-std.pages.dev/Types/isGenFn)
- [isInfinity](https://js-std.pages.dev/Types/isInfinity)
- [isJSON](https://js-std.pages.dev/Types/isJSON)
- [isMap](https://js-std.pages.dev/Types/isMap)
- [isNull](https://js-std.pages.dev/Types/isNull)
- [isNum](https://js-std.pages.dev/Types/isNum)
- [isObj](https://js-std.pages.dev/Types/isObj)
- [isPureObj](https://js-std.pages.dev/Types/isPureObj)
- [isRegEx](https://js-std.pages.dev/Types/isRegEx)
- [isSet](https://js-std.pages.dev/Types/isSet)
- [isStr](https://js-std.pages.dev/Types/isStr)
- [isSym](https://js-std.pages.dev/Types/isSym)
- [isTypedArr](https://js-std.pages.dev/Types/isTypedArr)
- [isUndef](https://js-std.pages.dev/Types/isUndef)
- [isWkMap](https://js-std.pages.dev/Types/isWkMap)
- [isWkRef](https://js-std.pages.dev/Types/isWkRef)
- [isWkSet](https://js-std.pages.dev/Types/isWkSet)

## Benchmarks

Some benchmark outputs are shown here for reference.

> [!IMPORTANT]  
> Our priorities are reliability and accuracy rather than performance.

```diff
clone:
┌───┬──────────────────────────┬─────────┬────────────────────┬────────┬─────────┐
│   │ Task Name                │ ops/sec │ Average Time (ns)  │ Margin │ Samples │
├───┼──────────────────────────┼─────────┼────────────────────┼────────┼─────────┤
│ 0 │ structuredClone (Native) │ 276,824 │ 3612.3959469709525 │ ±1.29% │ 27683   │
│ 1 │ _.cloneDeep (Lodash)     │ 216,965 │ 4609.032953864744  │ ±2.41% │ 21697   │
│ 2 │ R.clone (ramda)          │ 174,567 │ 5728.439422580611  │ ±1.92% │ 17457   │
│ 3 │ R2.clone (remeda)        │ 310,268 │ 3223.0154703960834 │ ±2.40% │ 31027   │
│ 4 │ cloneDeep (clone-deep)   │ 468,908 │ 2132.611673882092  │ ±1.70% │ 46891   │
│ 5 │ copy (fast-copy)         │ 486,179 │ 2056.852050680814  │ ±1.91% │ 48618   │
+ 6 │ clone                    │ 535,302 │ 1868.1028376072306 │ ±2.07% │ 53531   │
└───┴──────────────────────────┴─────────┴────────────────────┴────────┴─────────┘
*Note:
    - Here the lodash does not support errors, sparse arrays & objects in map keys.

    - Here the ramda & remeda does not support cloning Map & Set.

    - The fast-copy does not clone objects within Map, buffers in TypedArray, sparse arrays.

    - The clone-deep does not handle circular refs, does not clone objects within map,
    sparse arrays, internal refs within the object, TypedArray buffers & DataView.

sortBy:
┌───┬────────────────────┬───────────┬───────────────────┬────────┬─────────┐
│   │ Task Name          │ ops/sec   │ Average Time (ns) │ Margin │ Samples │
├───┼────────────────────┼───────────┼───────────────────┼────────┼─────────┤
│ 0 │ _.orderBy (Lodash) │ 1,231,295 │ 812.1529684071648 │ ±3.09% │ 123130  │
│ 1 │ R.sortWith (Ramda) │ 1,279,200 │ 781.7380570822326 │ ±2.27% │ 127921  │
│ 2 │ R2.sortBy (Remeda) │ 1,419,707 │ 704.3703291518029 │ ±2.81% │ 141971  │
│ 3 │ sort (Moderndash)  │ 2,697,568 │ 370.7042634668106 │ ±1.82% │ 269757  │
+ 4 │ sortBy             │ 2,728,366 │ 366.5196435965459 │ ±2.19% │ 272837  │
└───┴────────────────────┴───────────┴───────────────────┴────────┴─────────┘

*Note: Here the Moderndash does not support passing object prop as string.

isEql:
┌───┬─────────────────────────────────────┬─────────┬────────────────────┬────────┬─────────┐
│   │ Task Name                           │ ops/sec │ Average Time (ns)  │ Margin │ Samples │
├───┼─────────────────────────────────────┼─────────┼────────────────────┼────────┼─────────┤
│ 0 │ deepStrictEqual (Native)            │ 950,686 │ 1051.871609041841  │ ±0.24% │ 95069   │
│ 1 │ fastDeepEqual (fast-deep-equal/es6) │ 652,611 │ 1532.3058134904193 │ ±1.49% │ 65262   │
│ 2 │ dequal                              │ 120,791 │ 8278.7573675501    │ ±0.74% │ 12080   │
│ 3 │ _.isEqual (Lodash)                  │ 152,075 │ 6575.660376117521  │ ±2.02% │ 15208   │
│ 4 │ R.equals (Ramda)                    │ 51,496  │ 19418.976504855284 │ ±1.70% │ 5150    │
+ 5 │ isEql                               │ 104,355 │ 9582.655710998957  │ ±1.13% │ 10436   │
└───┴─────────────────────────────────────┴─────────┴────────────────────┴────────┴─────────┘

*Note:

  - The native util `deepStrictEqual` not available in browsers, does not check `Map` ordering & same invalid dates.
  - The `fast-deep-equal/es6` does not support cyclic refs, Map ordering check, invalid dates, symbols, objects values in Set & TypedArrays.
  - The lodash `isEqual` does not check `Map` ordering & object values in `Set`.
  - The ramda `equals` does not check `Map` ordering & symbols.
  - The dequal does not support cyclic refs, Map ordering, symbols & same invalid dates.
```

### Running benchmarks

```sh
$ bun run build
$ bun benchmark.js
```

## License

Copyright (c) [Thanga Ganapathy](https://github.com/Thanga-Ganapathy) ([MIT License](./LICENSE)).
