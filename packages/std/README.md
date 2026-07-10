<div align="center">

# @opentf/std

**The Modern JavaScript Standard Library.**

[![CI](https://github.com/Open-Tech-Foundation/js-std/actions/workflows/ci.yml/badge.svg)](https://github.com/Open-Tech-Foundation/js-std/actions/workflows/ci.yml)
[![JSR Score](https://jsr.io/badges/@opentf/std/score)](https://jsr.io/@opentf/std)

*Part of the <img src="https://raw.githubusercontent.com/Open-Tech-Foundation/website/3ed7ac70ec44465eec0f94e5185cb28a9b11ed07/static/img/OTF-Logo.svg" width="24" align="center" /> [Open Tech Foundation](https://github.com/Open-Tech-Foundation) ecosystem.*

[**Live Demo**](https://js-std.pages.dev/playground) | [**Documentation**](https://js-std.pages.dev) | [**Report Bug**](https://github.com/open-tech-foundation/js-std/issues)

</div>

---

> *A lightweight, high-accuracy, runtime-agnostic collection of essential utilities.*

## ✨ Features

- 🎨 **Intuitive API**: Designed for clarity, simplicity, and ease of use.
- 🌍 **Runtime Agnostic**: Uses standard JavaScript and capability detection instead of named-runtime branching.
- ⚡ **High Performance**: Optimized for speed without sacrificing accuracy.
- ⏳ **Modern Async**: Advanced tools for managing complex asynchronous flows.
- 🛡️ **Full Type Safety**: Built with TypeScript for deep, native type inference.
- 📦 **Zero Dependencies**: Lightweight, tree-shakeable, and ESM/CJS ready.
- 🌲 **Broad Compatibility**: Future-proof code with broad environment support.

## 🌍 Runtime Agnostic Design

`@opentf/std` avoids public runtime detection helpers. Utilities are written against standard JavaScript APIs and use feature/capability detection only where platform APIs are unavoidable.

This keeps the package portable across mainstream runtimes and smaller embeddable engines such as QuickJS, as long as the specific API a utility needs is available or polyfilled.

### 🛠️ Web Crypto Support

Crypto helpers use capability detection instead of runtime-name detection:

- Random and UUID helpers use Web Crypto when available and fall back to `node:crypto.webcrypto` in Node-compatible environments.
- Hash and HMAC helpers use Web Crypto when available and fall back to `node:crypto`.
- Helpers throw a clear error if neither capability exists.

For runtimes without either API, provide a Web Crypto polyfill before calling crypto utilities:

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

## 🧪 Testing

Run the project validation suite:

```sh
bun run ci
```

The CI suite builds the package, runs Biome linting, checks TypeScript, and executes the full Bun test suite.

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
import { isNumber, toNum } from "@opentf/std";

isNumber(NaN); //=> false
isNumber('1'); //=> false
isNumber(1); //=> true
toNum('1_000'); //=> 1000
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

### 7. Advanced Flow Control
```js
import { retryRun, rateLimitRun } from "@opentf/std";

// Automatically retry failed operations
await retryRun(fetchData, { retries: 3, delay: 1000 });

// Ensure a function is called no more than 5 times per second
const limitedFetch = rateLimitRun(fetchData, 5, 1000);
```

## 📖 API

- 📁 [**Local API Docs**](./packages/std/docs/README.md) - View the API reference directly in the repository.
- 🌐 [**Documentation Website**](https://js-std.pages.dev) - Searchable online version with examples, a live playground, and **Visual Flow Control Tools**.

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

## 🛡️ Security

Security is a top priority for `@opentf/std`. We implement proactive measures to protect your applications:

- **Prototype Pollution Protection**: All object manipulation utilities (like `set`, `merge`, `clone`, etc.) include built-in guards against prototype pollution attacks (CWE-1321).
- **Safe Path Traversal**: Path-based utilities strictly filter sensitive keys like `__proto__`, `constructor`, and `prototype`.
- **Zero Dependencies**: By maintaining a zero-dependency footprint, we eliminate the risk of supply-chain vulnerabilities from third-party packages.

---

## 📖 Articles

- [Introducing Our New JavaScript Standard Library](https://ganapathy.hashnode.dev/introducing-our-new-javascript-standard-library)
- [You Don't Need JavaScript Native Methods](https://ganapathy.hashnode.dev/you-dont-need-javascript-native-methods)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
