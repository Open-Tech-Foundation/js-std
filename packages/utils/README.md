<img align="left" src="https://open-tech-foundation.pages.dev/img/Logo.svg" width="50" height="50">

&nbsp;[OPEN TECH FOUNDATION](https://open-tech-foundation.pages.dev/)

<div align="center">

# Utils

[![Build](https://github.com/open-tech-foundation/js-utils/actions/workflows/build.yml/badge.svg)](https://github.com/open-tech-foundation/js-utils/actions/workflows/build.yml)

</div>

> A collection of JavaScript utility functions.

# [Playground](https://js-utils.pages.dev/playground) | [Documentation](https://js-utils.pages.dev)

## Installation

Using npm

```sh
npm install @opentf/utils
```

Using Yarn

```sh
yarn add @opentf/utils
```

Using pnpm

```sh
pnpm add @opentf/utils
```

## Usage

```ts
import { range, camelCase, sleep } from '@opentf/utils';

range(1, 5); //=> [1, 2, 3, 4, 5]

camelCase('i phone'); //=> 'iPhone'

await sleep(1000); // It suspends the exection for 1 second.
```

## License

Copyright (c) [Thanga Ganapathy](https://github.com/Thanga-Ganapathy) ([MIT License](../../LICENSE)).
