<div align="center">

# @opentf/std

**The Modern JavaScript Standard Library.**

[![CI](https://github.com/Open-Tech-Foundation/js-std/actions/workflows/ci.yml/badge.svg)](https://github.com/Open-Tech-Foundation/js-std/actions/workflows/ci.yml)
[![JSR Score](https://jsr.io/badges/@opentf/std/score)](https://jsr.io/@opentf/std)

*Part of the <img src="https://open-tech-foundation.pages.dev/img/Logo.svg" width="18" height="18" style="vertical-align: middle;" /> [Open Tech Foundation](https://github.com/Open-Tech-Foundation) ecosystem.*

[**Live Demo**](https://js-std.pages.dev/playground) | [**Documentation**](https://js-std.pages.dev) | [**Report Bug**](https://github.com/open-tech-foundation/js-std/issues)

</div>

---

> *A lightweight, high-accuracy, and cross-runtime collection of essential utilities.*
## ✨ Features

- 🎨 **Intuitive API**: Designed for clarity, simplicity, and ease of use.
- 🌍 **Runtime Agnostic**: Seamless execution across all JavaScript environments.
- ⚡ **High Performance**: Optimized for speed without sacrificing accuracy.
- ⏳ **Modern Async**: Advanced tools for managing complex asynchronous flows.
- 🛡️ **Full Type Safety**: Built with TypeScript for deep, native type inference.
- 📦 **Zero Dependencies**: Lightweight, tree-shakeable, and ESM/CJS ready.
- 🌲 **Broad Compatibility**: Future-proof code with broad environment support.

## 🌍 Environment Support

| Environment | Supported Versions | Note |
| :--- | :--- | :--- |
| **Node.js** | **>= 18.0.0** | **Polyfill required for Node 18** |
| **Browsers** | All modern browsers | Native |
| **Bun** | >= 1.0.0 | Native |
| **Deno** | >= 1.0.0 | Native |

### 🛠️ Node.js 18 Support

To use features like `uuid` or `randomBytes` in Node.js 18, you must manually polyfill the `webcrypto` API:

```js
import crypto from 'node:crypto';

if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: crypto.webcrypto,
    writable: true,
    configurable: true,
  });
}
```

## 📦 Installation

Install `@opentf/std` using your preferred package manager:

```sh
# Bun
bun add @opentf/std

# pnpm
pnpm add @opentf/std

# npm
npm install @opentf/std

# Deno
deno add @opentf/std
```

## 🛠 Usage

Explore the library's capabilities with these examples:

### 1. Checking if a Value is Numeric
```js
import { isNumber } from "@opentf/std";

isNumber(NaN); //=> false
isNumber('1'); //=> false
isNumber('1', true); //=> true
isNumber(1); //=> true
```

### 2. Converting Strings to Pascal Case
```js
import { pascalCase } from "@opentf/std";

pascalCase("pascal case"); //=> PascalCase
```

### 3. Sorting an Array in Descending Order
```js
import { sort } from "@opentf/std";

sort([1, 10, 21, 2], "desc"); //=> [21, 10, 2, 1]
```

### 4. Deep Cloning an Object
```js
import { clone } from "@opentf/std";

const obj = { a: 1, b: "abc", c: new Map([["key", "val"]]) };
clone(obj); // Returns deeply cloned value
```

### 5. Smart Equality
```js
import { isEql, isUnorderedEqual } from "@opentf/std";

isEql({a: 1}, {a: 1}); //=> true

const mapA = new Map([["a", 1], ["b", 2]]);
const mapB = new Map([["b", 2], ["a", 1]]);
isEql(mapA, mapB); //=> false

// Compare Arrays ignoring order
isUnorderedEqual([1, 2, 3], [2, 3, 1]); //=> true
```

### 6. Unified Color Conversion
```js
import { color, ColorFormat } from "@opentf/std";

color("orange", ColorFormat.HEX); //=> "#ffa500"
color("#00ffff", "rgba"); //=> "rgba(0, 255, 255, 1)"
```

## 📖 API

- 📁 [**Local API Docs**](./packages/std/docs/README.md) - View the API reference directly in the repository.
- 🌐 [**Documentation Website**](https://js-std.pages.dev) - Searchable online version with examples and a live playground.

---

## 📊 Benchmarks

We prioritize **reliability and accuracy** over extreme performance, while maintaining highly competitive speeds.

### `clone`
| Library | ops/sec | Average Time | Notes |
| :--- | :--- | :--- | :--- |
| **@opentf/std (clone)** | **466,736** | **~2.1μs** | **Full accuracy, supports all modern types.** |
| copy (fast-copy) | 434,805 | ~2.3μs | Missing some modern features. |
| cloneDeep (clone-deep) | 397,935 | ~2.5μs | No circular ref support. |
| structuredClone (Native) | 228,477 | ~4.4μs | Built-in native support. |
| _.cloneDeep (Lodash) | 161,017 | ~6.2μs | Lacks some modern features. |

### `sortBy`
| Library | ops/sec | Average Time |
| :--- | :--- | :--- |
| **@opentf/std (sortBy)** | **2,656,536** | **~376ns** |
| sort (Moderndash) | 2,799,559 | ~357ns |
| R2.sortBy (Remeda) | 1,604,434 | ~623ns |
| _.orderBy (Lodash) | 1,263,727 | ~791ns |
| R.sortWith (Ramda) | 1,066,487 | ~937ns |

### `isEql`
| Library | ops/sec | Average Time | Notes |
| :--- | :--- | :--- | :--- |
| **@opentf/std (isEql)** | **75,675** | **~13.2μs** | **Full accuracy, Map/Set ordering, Symbols.** |
| deepStrictEqual (Native) | 717,658 | ~1.4μs | Limited features, no browser support. |
| fastDeepEqual | 586,098 | ~1.7μs | Missing many modern features. |
| dequal | 375,797 | ~2.6μs | No cyclic refs or Map ordering. |
| _.isEqual (Lodash) | 137,667 | ~7.2μs | Missing Map/Set accuracy. |

> [!TIP]
> Run your own benchmarks: `bun run build && bun benchmark.js`

---

## 📖 Articles

- [Introducing Our New JavaScript Standard Library](https://ganapathy.hashnode.dev/introducing-our-new-javascript-standard-library)
- [You Don't Need JavaScript Native Methods](https://ganapathy.hashnode.dev/you-dont-need-javascript-native-methods)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
