---
sidebar_position: 1
title: Introduction
sidebar_label: Introduction
slug: /
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Utils

> A Collection of JavaScript Utility Functions.

## Installation

<Tabs>
  <TabItem value="npm" label="Npm" default>
    ```bash
    npm install @opentf/utils
    ```
  </TabItem>
  <TabItem value="yarn" label="Yarn">
    ```bash
    yarn add @opentf/utils
    ```
  </TabItem>
  <TabItem value="pnpm" label="Pnpm">
    ```bash
    pnpm add @opentf/utils
    ```
  </TabItem>
  <TabItem value="bun" label="Bun">
    ```bash
    bun add @opentf/utils
    ```
  </TabItem>
</Tabs>

## Usage

```ts
import { range, camelCase, sleep } from "@opentf/utils";

range(1, 5); //=> [1, 2, 3, 4, 5]

camelCase("i phone"); //=> 'iPhone'

await sleep(1000); // It suspends the exection for 1 second.
```

:::info

Try out these examples on the [playground](/playground)

:::
