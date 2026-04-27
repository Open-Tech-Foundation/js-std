# @opentf/std

## 1.0.0-beta.2

### Minor Changes

- 37a1df8: 🛡️ Security Fixes Implemented:

  Performed a security audit of all object-manipulation utilities and implemented strict key filtering to block access to sensitive keys (**proto**, constructor, prototype). The following utilities are now secured:

  set.ts: Prevented path-based pollution of the global prototype.
  unset.ts: Blocked the ability to delete properties from the global prototype (preventing DoS attacks).
  merge.ts & mergeAll.ts: Added guards to prevent deep-merging from traversing into internal object properties.
  clone.ts: Ensured that cloning an object cannot inadvertently modify the prototype of the new instance.
  mapKeys.ts: Protected against transformation mappers that return sensitive key names.

## 1.0.0-beta.1

### Patch Changes

- fae9b36: Fixed build to have readme and license copied for publishing.

## 1.0.0-beta.0

### Major Changes

- 46ad161: ### v1.0.0-beta.0 Release Audit & Stabilization

  - **Project Modernization**: Migrated the entire codebase to **Bun**, **Vitest**, and **Biome**. Overhauled the build system and CI pipeline for high-performance execution and cross-runtime verification.
  - **FlowControl Module**: Introduced a comprehensive suite of execution control utilities:
    - `idleRun` (Debounce with leading/trailing/maxWait)
    - `paceRun` (Throttle with leading/trailing)
    - `batchRun` (Argument grouping and delayed execution)
    - `memoizeRun` (Async caching with Single Flight and TTL)
    - `retryRun` (Exponential backoff and retry logic)
    - `timeoutRun` (Enforce execution time limits)
    - `rateLimitRun` (Rolling window rate limiting)
  - **Unified Color Utility**: Replaced fragmented color functions with a powerful, unified `color` utility supporting **Hex**, **RGB**, **HSL**, and **OKLCH**. Added advanced features like `colorMix`, `colorContrast`, `colorInvert`, and **ANSI TrueColor** support.
  - **Crypto & Encoding**: Added industrial-strength utilities for `uuidv4`, `uuidv7`, `randomId`, `base64`, and `hex` encoding/decoding.
  - **Math Utilities**:
    - Refactored `sum`, `prod`, `mean`, `median`, and `mode` to be generic `<T>`, supporting object arrays with custom callbacks.
    - Corrected `prod([])` to return `1` (mathematical empty product).
    - Fixed `mode` to return `[]` for unique element sets.
  - **Array Utilities**:
    - `min`, `max`, and `bounds` now support string arrays (lexicographical comparison).
    - Overhauled `range` and `sortBy` for better performance and compliance with ECMAScript proposals.
  - **String Utilities**:
    - Rewrote `stringWidth` to use `Intl.Segmenter` for accurate character counting.
    - Improved `stripANSI` regex for broader terminal sequence coverage.
  - **Object Utilities**:
    - Standardized performance for `merge`, `clone`, `omit`, and `pick`.
    - Added strict input clamping and enhanced error handling across all path-based utilities.
  - **Documentation & DX**:
    - Launched a premium Nextra-based documentation site with interactive REPL demos for every utility.
    - Audited and refactored all 148+ utilities for consistency.
    - Added project branding and version badges.

## 0.13.0

### Minor Changes

- 8d0ddfd: Added aResolvers aync utils.

## 0.12.0

### Minor Changes

- 66bdf45: Fixed isObj to support class.

## 0.11.0

### Minor Changes

- 0d1451e: Added mutable set & unset variant functions.

## 0.10.0

### Minor Changes

- 7a05b94: Added array shuffle & swap functions.

## 0.9.0

### Minor Changes

- 928a959: Added Set Composition methods like isSubsetOf, isSupersetOf & isDisjointFrom and Fixed size function to return -1 instead of null for unsupported types.

## 0.8.1

### Patch Changes

- f12c647: Updated readme with articles section.

## 0.8.0

### Minor Changes

- 1de5642: Fixed arrReplace by adding deleteCount param.

## 0.7.0

### Minor Changes

- 7b26d14: Added rgbToHex color function.

## 0.6.2

### Patch Changes

- 27f58d2: Updated pkg repo field.

## 0.6.1

### Patch Changes

- 2306bde: Updated readme with jsr badge.

## 0.6.0

### Minor Changes

- 3d6e4d9: Added functions composition related functions, Math avg & Array reverse fns.

## 0.5.1

### Patch Changes

- 93dd23b: Updated readme.

## 0.5.0

### Minor Changes

- 9b23586: Fixed async fns not awaiting within cb fn.

## 0.4.0

### Minor Changes

- 15b0271: Added array intersperse fn.

## 0.3.0

### Minor Changes

- 7bbe29a: Added buffers, errors, regex support for clone fn.

## 0.2.0

### Minor Changes

- d92933d: Fixed isEql assertion.

## 0.1.1

### Patch Changes

- b9e7b07: Updated readme.

## 0.1.0

### Minor Changes

- b0bbd90: Release initial version for @opentf/std

## 0.42.0

### Minor Changes

- 3106d1c: Fixed range fn based on the iterator range proposal.

## 0.41.0

### Minor Changes

- b6d79ca: Fixed cloning sparsed arrays.

## 0.40.0

### Minor Changes

- 39f3fc1: Added object omit & pick util fns.

## 0.39.0

### Minor Changes

- 1c8ea8b: Added object get, set, has, unset, fromPath & toPath utils.

## 0.38.0

### Minor Changes

- 133b4d0: Added symDiff, union, uniq & renamed some array utils.

## 0.37.0

### Minor Changes

- 9472d6c: Added async map & forEach fns.

## 0.36.0

### Minor Changes

- fec646b: Changed move fn to return new array.

## 0.35.0

### Minor Changes

- 4354b39: Added arrIns, arrReplace, arrRm & countBy array util fns.

## 0.34.0

### Minor Changes

- 08dc207: Added chunk, compact, intersection, isEqlArr util fns.

## 0.33.0

### Minor Changes

- 49fc010: Added isEql common util fn.

## 0.32.0

### Minor Changes

- bdbf93b: Added strReplace fn.

## 0.31.0

### Minor Changes

- 2ea7424: Added merge utils fns & renamed arrayDiff to diff

## 0.30.0

### Minor Changes

- 9f6026e: Fixed sorting issues.

## 0.29.0

### Minor Changes

- ff6d1f3: Added array, maths, types, object category utility fns.

## 0.28.0

### Minor Changes

- 3c9b6cf: Added type assertion utility fns.

## 0.27.0

### Minor Changes

- 5a4ff85: Added isShallowEql fn for comparing two values by shallow comparison.

## 0.26.0

### Minor Changes

- 8bafd6f: Added isJSON types utility fn.

## 0.25.0

### Minor Changes

- 2942e8b: Fixed groupBy types.

## 0.24.1

### Patch Changes

- a0937e1: Updated readme.

## 0.24.0

### Minor Changes

- cb6520c: Added array move utility fn.

## 0.23.0

### Minor Changes

- 29b2671: Added unset util fn & removed inferType util.

## 0.22.1

### Patch Changes

- aab4313: Updated readme.

## 0.22.0

### Minor Changes

- c7379da: Added pkg provenance support

## 0.21.0

### Minor Changes

- d6be858: Added array groupBy util function.
- 39b6947: Removed unwanted flooring of values in percentage calc.

## 0.20.0

### Minor Changes

- c1d68f9: Added hexToRGB color values converting util.

## 0.19.0

### Minor Changes

- 2630912: Added array async filter fn

## 0.18.0

### Minor Changes

- 34140c6: Fixed insertAt to allow empty string to be inserted.

## 0.17.0

### Minor Changes

- 648dc19: Fixed `replaceAt` to accept empty string to be replaced.

## 0.16.3

### Patch Changes

- 5076976: Added playground link to readme

## 0.16.2

### Patch Changes

- 91ea57c: Added missing usage section to readme

## 0.16.1

### Patch Changes

- 83a8f64: Added usage section to readme

## 0.16.0

### Minor Changes

- df9233d: Added range utility function.

## 0.15.0

### Minor Changes

- 3a4ab6c: Migrate from parcel, yarn workspaces to turborepo, tsup, etc.
