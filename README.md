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
import { isNum, range, pascalCase, sleep } from "@opentf/utils";

isNum(NaN); //=> false

range(1, 5); //=> [1, 2, 3, 4, 5]

pascalCase("pascal case"); //=> PascalCase

await sleep(1000); // It suspends the exection for 1 second.
```

## API

### Array

- [arrayDiff](https://js-utils.pages.dev/docs/Array/arrayDiff)
- [asyncFilter](https://js-utils.pages.dev/docs/Array/asyncFilter)
- [groupBy](https://js-utils.pages.dev/docs/Array/groupBy)
- [range](https://js-utils.pages.dev/docs/Array/range)
- [move](https://js-utils.pages.dev/docs/Array/move)

### Maths

- [percentage](https://js-utils.pages.dev/docs/Maths/percentage)
- [percentageOf](https://js-utils.pages.dev/docs/Maths/percentageOf)

### Misc

- [hexToRGB](https://js-utils.pages.dev/docs/Misc/hexToRGB)
- [sleep](https://js-utils.pages.dev/docs/Timers/sleep)

### Object

- [cloneObj](https://js-utils.pages.dev/docs/Object/cloneObj)
- [getInObj](https://js-utils.pages.dev/docs/Object/getInObj)
- [setInObj](https://js-utils.pages.dev/docs/Object/setInObj)
- [delInObj](https://js-utils.pages.dev/docs/Object/delInObj)
- [isShallowEql](https://js-utils.pages.dev/docs/Object/isShallowEql)

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

## License

Copyright (c) [Thanga Ganapathy](https://github.com/Thanga-Ganapathy) ([MIT License](./LICENSE)).
