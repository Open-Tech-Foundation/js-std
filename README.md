<img align="left" src="https://open-tech-foundation.pages.dev/img/Logo.svg" width="50" height="50">

&nbsp;[OPEN TECH FOUNDATION](https://open-tech-foundation.pages.dev/)

<div align="center">

# Utils

[![Build](https://github.com/open-tech-foundation/js-utils/actions/workflows/build.yml/badge.svg)](https://github.com/open-tech-foundation/js-utils/actions/workflows/build.yml) <a href="https://pkg-size.dev/@opentf/utils"><img src="https://pkg-size.dev/badge/bundle/3224" title="Bundle size for @opentf/utils"></a>

</div>

> A collection of JavaScript utility functions.

# [Playground](https://js-utils.pages.dev/playground) | [Documentation](https://js-utils.pages.dev)

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
import { range, camelCase, sleep } from "@opentf/utils";

range(1, 5); //=> [1, 2, 3, 4, 5]

camelCase("i phone"); //=> 'iPhone'

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

### String

- [camelCase](https://js-utils.pages.dev/docs/String/camelCase)
- [capitalize](https://js-utils.pages.dev/docs/String/capitalize)
- [insertAt](https://js-utils.pages.dev/docs/String/insertAt)
- [isEmail](https://js-utils.pages.dev/docs/String/isEmail)
- [pascalCase](https://js-utils.pages.dev/docs/String/pascalCase)
- [replaceAt](https://js-utils.pages.dev/docs/String/replaceAt)

### Types

- [isObj](https://js-utils.pages.dev/docs/Object/isObj)
- [isNumber](https://js-utils.pages.dev/docs/Types/isNumber)

## License

Copyright (c) [Thanga Ganapathy](https://github.com/Thanga-Ganapathy) ([MIT License](./LICENSE)).
