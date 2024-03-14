<img align="left" src="https://open-tech-foundation.pages.dev/img/Logo.svg" width="50" height="50">

&nbsp;[OPEN TECH FOUNDATION](https://open-tech-foundation.pages.dev/)

<div align="center">

# Utils

[![Build](https://github.com/open-tech-foundation/js-utils/actions/workflows/build.yml/badge.svg)](https://github.com/open-tech-foundation/js-utils/actions/workflows/build.yml)

</div>

> A collection of JavaScript utility functions.

# [Playground](https://js-utils.pages.dev/playground) | [Documentation](https://js-utils.pages.dev)

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
import { isNum, range, pascalCase, sleep } from '@opentf/utils';

isNum(NaN); //=> false

range(1, 5); //=> [1, 2, 3, 4, 5]

pascalCase('pascal case'); //=> PascalCase

await sleep(1000); // It suspends the exection for 1 second.
```

## API

### Array

- [arrDiff](https://js-utils.pages.dev/docs/Array/arrDiff)
- [asyncFilter](https://js-utils.pages.dev/docs/Array/asyncFilter)
- [groupBy](https://js-utils.pages.dev/docs/Array/groupBy)
- [range](https://js-utils.pages.dev/docs/Array/range)
- [move](https://js-utils.pages.dev/docs/Array/move)
- [sort](https://js-utils.pages.dev/docs/Array/sort)
- [sortBy](https://js-utils.pages.dev/docs/Array/sortBy)

### Maths

- [percentage](https://js-utils.pages.dev/docs/Maths/percentage)
- [percentageOf](https://js-utils.pages.dev/docs/Maths/percentageOf)

### Function

- [sleep](https://js-utils.pages.dev/docs/Timers/sleep)
- [noop](https://js-utils.pages.dev/docs/Timers/noop)

### Colors

- [hexToRGB](https://js-utils.pages.dev/docs/Misc/hexToRGB)

### Object

- [clone](https://js-utils.pages.dev/docs/Object/clone)
- [getInObj](https://js-utils.pages.dev/docs/Object/getInObj)
- [delInObj](https://js-utils.pages.dev/docs/Object/delInObj)
- [isEmpty](https://js-utils.pages.dev/docs/Object/isEmpty)
- [isNil](https://js-utils.pages.dev/docs/Object/isNil)
- [isShallowEql](https://js-utils.pages.dev/docs/Object/isShallowEql)
- [setInObj](https://js-utils.pages.dev/docs/Object/setInObj)
- [size](https://js-utils.pages.dev/docs/Object/size)

### String

- [camelCase](https://js-utils.pages.dev/docs/String/camelCase)
- [capitalize](https://js-utils.pages.dev/docs/String/capitalize)
- [insertAt](https://js-utils.pages.dev/docs/String/insertAt)
- [isEmail](https://js-utils.pages.dev/docs/String/isEmail)
- [pascalCase](https://js-utils.pages.dev/docs/String/pascalCase)
- [replaceAt](https://js-utils.pages.dev/docs/String/replaceAt)

### Types

- [isArr](https://js-utils.pages.dev/Types/isArr)
- [isArrBuf](https://js-utils.pages.dev/Types/isArrBuf)
- [isBigInt](https://js-utils.pages.dev/Types/isBigInt)
- [isBlob](https://js-utils.pages.dev/Types/isBlob)
- [isBool](https://js-utils.pages.dev/Types/isBool)
- [isDate](https://js-utils.pages.dev/Types/isDate)
- [isErr](https://js-utils.pages.dev/Types/isErr)
- [isFn](https://js-utils.pages.dev/Types/isFn)
- [isJSON](https://js-utils.pages.dev/docs/Types/isJSON)
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

```

### Running benchmarks

```sh
bun benchmark.js
```

## License

Copyright (c) [Thanga Ganapathy](https://github.com/Thanga-Ganapathy) ([MIT License](../../LICENSE)).
