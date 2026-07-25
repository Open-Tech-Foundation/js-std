<div align="center">

# @opentf/std

**The Modern JavaScript Standard Library.**

[**Website**](https://js-std.opentechf.org) | [**Docs**](./packages/std/docs/README.md) | [**Playground**](https://js-std.opentechf.org/playground)

</div>

---

> *A lightweight, high-accuracy, runtime-agnostic collection of essential utilities.*

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

# yarn
yarn add @opentf/std
```

## 🚀 Quick Start

Beyond the everyday helpers, `@opentf/std` ships capabilities you'd normally reach for a separate package to get:

```js
import {
  Decimal,
  color,
  colorContrast,
  formatBytes,
  formatCurrency,
  uuidv7,
  stringWidth,
} from "@opentf/std";

// 🎯 Exact decimal math — no floating-point errors
new Decimal("0.1").add("0.2").toString(); //=> "0.3"

// 🎨 Color parsing, conversion & WCAG accessibility
color("rebeccapurple", "hex"); //=> "#663399"
colorContrast("white", "black"); //=> 21  (WCAG ratio)

// 💾 Human-readable, locale-aware formatting
formatBytes(1234567); //=> "1.18 MiB"
formatCurrency(1200, "EUR", { locale: "de-DE" }); //=> "1.200,00 €"

// 🆔 Time-sortable UUID via runtime-agnostic crypto
uuidv7(); //=> "0195e2a4-8c3d-7000-…"

// 📏 Emoji & CJK aware string width (terminal-safe)
stringWidth("🔥こんにちは"); //=> 12
```

## 👉 Next Steps

- 🎮 Try the [Interactive Playground](https://js-std.opentechf.org/playground) — visualize `idleRun`, `paceRun`, `batchRun`, `rateLimitRun` & `retryRun` in real time.
- 🧪 Explore standout utilities: [`Decimal`](https://js-std.opentechf.org/docs/Maths/Decimal), [`color`](https://js-std.opentechf.org/docs/Colors/color), [`uuidv7`](https://js-std.opentechf.org/docs/Crypto/uuidv7), [`formatCurrency`](https://js-std.opentechf.org/docs/Number/formatCurrency), lazy [`Iterators`](https://js-std.opentechf.org/docs/Iter/mapIter) and [set math](https://js-std.opentechf.org/docs/Maths/isSubsetOf).
- 📚 Browse every utility by category in the [Repository Documentation](./packages/std/docs/README.md) (or on the [Website](https://js-std.opentechf.org)).

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
