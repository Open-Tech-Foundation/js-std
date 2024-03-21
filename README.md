<img align="left" src="https://open-tech-foundation.pages.dev/img/Logo.svg" width="50" height="50">

&nbsp;[OPEN TECH FOUNDATION](https://open-tech-foundation.pages.dev/)

<div align="center">

# Utils

[![Build](https://github.com/open-tech-foundation/js-utils/actions/workflows/build.yml/badge.svg)](https://github.com/open-tech-foundation/js-utils/actions/workflows/build.yml)

</div>

> A collection of JavaScript utility functions.

<div align="center">

## [Playground](https://js-utils.pages.dev/playground) | [Documentation](https://js-utils.pages.dev)

</div>

## Features

- Simple API
- Practical Default Options
- Includes Async Utils
- TypeScript Support
- ESM

## Installation

```sh
npm install @opentf/utils
```

```sh
yarn add @opentf/utils
```

```sh
pnpm add @opentf/utils
```

```sh
bun add @opentf/utils
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
} from "@opentf/utils";

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

- [arrIns](https://js-utils.pages.dev/Array/arrIns)
- [arrReplace](https://js-utils.pages.dev/Array/arrReplace)
- [arrRm](https://js-utils.pages.dev/Array/arrRm)
- [bounds](https://js-utils.pages.dev/Array/bounds)
- [chunk](https://js-utils.pages.dev/Array/chunk)
- [compact](https://js-utils.pages.dev/Array/compact)
- [countBy](https://js-utils.pages.dev/Array/countBy)
- [diff](https://js-utils.pages.dev/Array/diff)
- [groupBy](https://js-utils.pages.dev/Array/groupBy)
- [intersection](https://js-utils.pages.dev/Array/intersection)
- [max](https://js-utils.pages.dev/Array/max)
- [min](https://js-utils.pages.dev/Array/min)
- [move](https://js-utils.pages.dev/Array/move)
- [range](https://js-utils.pages.dev/Array/range)
- [sort](https://js-utils.pages.dev/Array/sort)
- [sortBy](https://js-utils.pages.dev/Array/sortBy)
- [symDiff](https://js-utils.pages.dev/Array/symDiff)
- [union](https://js-utils.pages.dev/Array/union)
- [uniq](https://js-utils.pages.dev/Array/uniq)

## Async

- [asyncFilter](https://js-utils.pages.dev/Array/asyncFilter)
- [asyncForEach](https://js-utils.pages.dev/Array/asyncForEach)
- [asyncMap](https://js-utils.pages.dev/Array/asyncMap)

### Maths

- [percentage](https://js-utils.pages.dev/Maths/percentage)
- [percentageOf](https://js-utils.pages.dev/Maths/percentageOf)

### Number

- [clamp](https://js-utils.pages.dev/Number/clamp)
- [isNegZero](https://js-utils.pages.dev/Number/isNegZero)
- [isZero](https://js-utils.pages.dev/Number/isZero)
- [toNum](https://js-utils.pages.dev/Number/toNum)

### Function

- [sleep](https://js-utils.pages.dev/Timers/sleep)
- [noop](https://js-utils.pages.dev/Timers/noop)

### Colors

- [hexToRGB](https://js-utils.pages.dev/Misc/hexToRGB)

### Assert

- [isEmpty](https://js-utils.pages.dev/Assert/isEmpty)
- [isEql](https://js-utils.pages.dev/Assert/isEql)
- [isEqlArr](https://js-utils.pages.dev/Assert/isEqlArr)
- [isNil](https://js-utils.pages.dev/Assert/isNil)
- [isShallowEql](https://js-utils.pages.dev/Assert/isShallowEql)

### Object

- [clone](https://js-utils.pages.dev/Object/clone)
- [fromPath](https://js-utils.pages.dev/Object/fromPath)
- [get](https://js-utils.pages.dev/Object/get)
- [has](https://js-utils.pages.dev/Object/has)
- [merge](https://js-utils.pages.dev/Object/merge)
- [mergeAll](https://js-utils.pages.dev/Object/mergeAll)
- [set](https://js-utils.pages.dev/Object/set)
- [shallowMerge](https://js-utils.pages.dev/Object/shallowMerge)
- [shallowMergeAll](https://js-utils.pages.dev/Object/shallowMergeAll)
- [size](https://js-utils.pages.dev/Object/size)
- [toPath](https://js-utils.pages.dev/Object/toPath)
- [unset](https://js-utils.pages.dev/Object/unset)

### String

- [camelCase](https://js-utils.pages.dev/String/camelCase)
- [capitalize](https://js-utils.pages.dev/String/capitalize)
- [insertAt](https://js-utils.pages.dev/String/insertAt)
- [isEmail](https://js-utils.pages.dev/String/isEmail)
- [pascalCase](https://js-utils.pages.dev/String/pascalCase)
- [replaceAt](https://js-utils.pages.dev/String/replaceAt)
- [strReplace](https://js-utils.pages.dev/String/strReplace)

### Types

- [isArr](https://js-utils.pages.dev/Types/isArr)
- [isArrBuf](https://js-utils.pages.dev/Types/isArrBuf)
- [isBigInt](https://js-utils.pages.dev/Types/isBigInt)
- [isBlob](https://js-utils.pages.dev/Types/isBlob)
- [isBool](https://js-utils.pages.dev/Types/isBool)
- [isDate](https://js-utils.pages.dev/Types/isDate)
- [isErr](https://js-utils.pages.dev/Types/isErr)
- [isFn](https://js-utils.pages.dev/Types/isFn)
- [isJSON](https://js-utils.pages.dev/Types/isJSON)
- [isMap](https://js-utils.pages.dev/Types/isMap)
- [isNull](https://js-utils.pages.dev/Types/isNull)
- [isNum](https://js-utils.pages.dev/Types/isNum)
- [isObj](https://js-utils.pages.dev/Types/isObj)
- [isRegEx](https://js-utils.pages.dev/Types/isRegEx)
- [isSet](https://js-utils.pages.dev/Types/isSet)
- [isStr](https://js-utils.pages.dev/Types/isStr)
- [isSym](https://js-utils.pages.dev/Types/isSym)
- [isTypedArr](https://js-utils.pages.dev/Types/isTypedArr)
- [isUndef](https://js-utils.pages.dev/Types/isUndef)
- [isWkMap](https://js-utils.pages.dev/Types/isWkMap)
- [isWkRef](https://js-utils.pages.dev/Types/isWkRef)
- [isWkSet](https://js-utils.pages.dev/Types/isWkSet)

## Benchmarks

Some benchmark outputs are shown here for reference.

> [!IMPORTANT]  
> Our priorities are reliability and accuracy rather than performance.

```sh
clone:
┌───┬──────────────────────────┬─────────┬────────────────────┬────────┬─────────┐
│   │ Task Name                │ ops/sec │ Average Time (ns)  │ Margin │ Samples │
├───┼──────────────────────────┼─────────┼────────────────────┼────────┼─────────┤
│ 0 │ structuredClone (Native) │ 246,358 │ 4059.129038804869  │ ±1.65% │ 24636   │
│ 1 │ _.cloneDeep (Lodash)     │ 169,432 │ 5902.043319168882  │ ±2.53% │ 16944   │
│ 2 │ R.clone (ramda)          │ 178,957 │ 5587.9189808343945 │ ±2.26% │ 17897   │
│ 3 │ R2.clone (remeda)        │ 314,247 │ 3182.204862216371  │ ±1.75% │ 31426   │
│ 4 │ clone                    │ 399,634 │ 2502.2859323385046 │ ±2.06% │ 39964   │
└───┴──────────────────────────┴─────────┴────────────────────┴────────┴─────────┘
*Note: Here the ramda & remeda does not support cloning Map & Set.

sortBy:
┌───┬────────────────────┬───────────┬───────────────────┬────────┬─────────┐
│   │ Task Name          │ ops/sec   │ Average Time (ns) │ Margin │ Samples │
├───┼────────────────────┼───────────┼───────────────────┼────────┼─────────┤
│ 0 │ _.orderBy (Lodash) │ 1,231,295 │ 812.1529684071648 │ ±3.09% │ 123130  │
│ 1 │ R.sortWith (Ramda) │ 1,279,200 │ 781.7380570822326 │ ±2.27% │ 127921  │
│ 2 │ R2.sortBy (Remeda) │ 1,419,707 │ 704.3703291518029 │ ±2.81% │ 141971  │
│ 3 │ sort (Moderndash)  │ 2,697,568 │ 370.7042634668106 │ ±1.82% │ 269757  │
│ 4 │ sortBy             │ 2,728,366 │ 366.5196435965459 │ ±2.19% │ 272837  │
└───┴────────────────────┴───────────┴───────────────────┴────────┴─────────┘

*Note: Here the Moderndash does not support passing object prop as string.

isEql:
┌───┬─────────────────────────────────────┬─────────┬───────────────────┬────────┬─────────┐
│   │ Task Name                           │ ops/sec │ Average Time (ns) │ Margin │ Samples │
├───┼─────────────────────────────────────┼─────────┼───────────────────┼────────┼─────────┤
│ 0 │ deepStrictEqual (Native)            │ 927,921 │ 1077.676882954431 │ ±0.38% │ 92793   │
│ 1 │ fastDeepEqual (fast-deep-equal/es6) │ 638,108 │ 1567.132684562446 │ ±1.42% │ 63813   │
│ 2 │ _.isEqual (Lodash)                  │ 142,592 │ 7013.003366058248 │ ±2.13% │ 14260   │
│ 3 │ R.equals (Ramda)                    │ 50,346  │ 19862.42184707051 │ ±1.83% │ 5035    │
│ 4 │ isEql                               │ 109,127 │ 9163.615962614227 │ ±1.28% │ 10913   │
└───┴─────────────────────────────────────┴─────────┴───────────────────┴────────┴─────────┘

*Note:

- The native util `deepStrictEqual` not available in browsers, does not check `Map` ordering & returns false for same invalid dates.
- The `fast-deep-equal/es6` does not support cyclic refs, Map ordering check, invalid dates, symbols, objects values in Set & TypedArrays.
- The lodash `isEqual` does not check `Map` ordering & object values in `Set`.
- The ramda `equals` does not check `Map` ordering & symbols.
```

### Running benchmarks

```sh
$ bun run build
$ bun benchmark.js
```

## License

Copyright (c) [Thanga Ganapathy](https://github.com/Thanga-Ganapathy) ([MIT License](./LICENSE)).
